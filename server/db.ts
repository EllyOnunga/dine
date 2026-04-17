import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '@shared/schema';

// Required for production/build where 'pg' might be loaded slightly differently
const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/dine_db";
  // throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export async function connectToDatabase(): Promise<void> {
  try {
    const client = await pool.connect();
    client.release();
    console.log(`Connected to PostgreSQL`);
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error);
    // Don't throw immediately, let it retry or fail on queries
  }
}

export function getDb() {
  return db;
}

export async function closeDatabase(): Promise<void> {
  await pool.end();
}