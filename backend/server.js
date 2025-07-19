import express from 'express';
import cron from 'node-cron';
import { enqueueAllJobs } from './cron/scheduler.js';

const app = express();
app.use(express.json());

// Schedule cron job every hour
cron.schedule('0 * * * *', () => {
    enqueueAllJobs();
});

app.get('/', (req, res) => {
    res.send('Job Import Service is running');
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
