import { MongoClient } from 'mongodb';


const mongoose = require('mongoose');
const uri = "mongodb+srv://rinkal:1234@jobs.0uftyyk.mongodb.net/?retryWrites=true&w=majority&appName=jobs";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
await mongoose.connect(uri, clientOptions);
await mongoose.connection.db.admin().command({ ping: 1 });

const db = mongoose.db('job_import');
export const jobsCollection = db.collection('jobs');

export async function upsertJob(job) {
    const result = await jobsCollection.updateOne(
        { jobId: job.id }, // Use a unique identifier
        { $set: job },
        { upsert: true }
    );
    return result.upsertedCount > 0 ? 'inserted' : 'updated';
}
