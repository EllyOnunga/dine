import { Pool, PoolConfig } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const poolConfig: PoolConfig = {
    connectionString: process.env.DATABASE_URL || "postgres://localhost:5432/postgres",
};

// Enable SSL for RDS and other managed databases in production
// But allow disabling it for local production-like Docker setups via DISABLE_DB_SSL
if (process.env.NODE_ENV === 'production' && process.env.DISABLE_DB_SSL !== 'true') {
    poolConfig.ssl = {
        rejectUnauthorized: false
    };
}

export const pool = new Pool(poolConfig);
export const db = drizzle(pool, { schema });
