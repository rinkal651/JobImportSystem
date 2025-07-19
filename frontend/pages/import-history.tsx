import { useEffect, useState } from 'react';

type ImportLog = {
    _id: string;
    sourceUrl: string;
    timestamp: string;
    totalFetched: number;
    inserted: number;
    updated: number;
    failed: number;
    errors: { jobId?: string; reason: string }[];
};

export default function ImportHistory() {
    const [logs, setLogs] = useState<ImportLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/import-history')
            .then((res) => res.json())
            .then((data) => {
                setLogs(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading import history...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Import History</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Source URL</th>
                        <th>Total</th>
                        <th>Inserted</th>
                        <th>Updated</th>
                        <th>Failed</th>
                        <th>Errors</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log._id}>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                            <td>{log.sourceUrl}</td>
                            <td>{log.totalFetched}</td>
                            <td>{log.inserted}</td>
                            <td>{log.updated}</td>
                            <td>{log.failed}</td>
                            <td>
                                {log.errors.length > 0 ? (
                                    <ul>
                                        {log.errors.map((e, i) => (
                                            <li key={i}>
                                                {e.jobId ? `Job ${e.jobId}: ` : ''}{e.reason}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    '—'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
