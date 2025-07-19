const logsCollection = db.collection('import_logs');

export async function logImportRun({
    sourceUrl,
    timestamp,
    totalFetched,
    inserted,
    updated,
    failed,
    errors,
}) {
    await logsCollection.insertOne({
        sourceUrl,
        timestamp,
        totalFetched,
        inserted,
        updated,
        failed,
        errors,
    });
}
