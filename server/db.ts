import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use a dummy connection string if not set, to allow the app to start
// in MemStorage mode. The pool will only error if a query is actually executed.
export const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://localhost:5432/postgres" });
export const db = drizzle(pool, { schema });
