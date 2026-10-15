const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(process.env.MONGO_DB_NAME || 'deshi_buy');
    console.log('MongoDB connected');
    return db;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

function getDB() {
  if (!db) throw new Error('Database not initialized');
  return db;
}

module.exports = { connectDB, getDB };
