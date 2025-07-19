import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import fetch from 'node-fetch';
import { parseXMLtoJSON } from '../services/xmlParser.js';
import { upsertJob } from '../services/jobService.js';
import { logImportRun } from '../services/logService.js';

const worker = new Worker(
    'job-import-queue',
    async (job) => {
        const { sourceUrl } = job.data;
        try {
            const xml = await fetch(sourceUrl).then((res) => res.text());
            const jobList = parseXMLtoJSON(xml);

            let inserted = 0,
                updated = 0,
                failed = 0;
            const errors = [];

            for (const jobData of jobList) {
                try {
                    const status = await upsertJob(jobData);
                    status === 'inserted' ? inserted++ : updated++;
                } catch (err) {
                    failed++;
                    errors.push({ jobId: jobData.id, reason: err.message });
                }
            }

            await logImportRun({
                sourceUrl,
                timestamp: new Date(),
                totalFetched: jobList.length,
                inserted,
                updated,
                failed,
                errors,
            });

            console.log(
                `Imported from ${sourceUrl}: ${inserted} new, ${updated} updated, ${failed} failed`
            );
        } catch (err) {
            console.error(`Failed to process ${sourceUrl}:`, err.message);
            await logImportRun({
                sourceUrl,
                timestamp: new Date(),
                totalFetched: 0,
                inserted: 0,
                updated: 0,
                failed: 1,
                errors: [{ reason: err.message }],
            });
        }
    },
    {
        connection: redisConnection,
        concurrency: 5, // configurable
    }
);

console.log('Worker is running...');
