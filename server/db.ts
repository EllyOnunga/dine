import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/dine_db";

export const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
});

let db: Db;

export async function connectToDatabase(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db();
    console.log(`Connected to MongoDB: ${db.databaseName}`);
  }
  return db;
}

export function getDb(): Db {
  if (!db) {
    throw new Error("Database not initialized. Call connectToDatabase() first.");
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  await client.close();
  db = undefined as unknown as Db;
}