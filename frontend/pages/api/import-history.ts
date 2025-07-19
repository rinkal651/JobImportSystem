import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';


const mongoose = require('mongoose');
const uri = "mongodb+srv://rinkal:1234@jobs.0uftyyk.mongodb.net/?retryWrites=true&w=majority&appName=jobs";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });

        const db = mongoose.db('job_import');
        const logs = await db.collection('import_logs')
            .find({})
            .sort({ timestamp: -1 })
            .limit(50)
            .toArray();

        res.status(200).json(logs);
    } catch (err) {
        console.error('Error fetching import logs:', err);
        res.status(500).json({ error: 'Failed to load import history' });
    }
}
