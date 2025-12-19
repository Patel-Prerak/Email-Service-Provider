// Quick script to clear old email analyses from MongoDB
// Run this with: node clear_old_emails.js

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/email-analyzer';

async function clearEmails() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db();
        const collection = db.collection('analyzedemails'); // Mongoose uses lowercase plural

        const result = await collection.deleteMany({});
        console.log(`✅ Deleted ${result.deletedCount} old email analyses`);
        console.log('You can now test with fresh scans!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

clearEmails();
