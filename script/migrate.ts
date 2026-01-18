import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as schema from '../shared/schema';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
    console.log('Starting migration process...');

    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is missing');
    }

    // Handle potential self-signed certs in production (common with Render/Neon)
    const sslConfig = process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false;

    console.log('Connecting to database...', {
        ssl: !!sslConfig,
        node_env: process.env.NODE_ENV
    });

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: sslConfig,
        connectionTimeoutMillis: 5000,
    });

    const db = drizzle(pool, { schema });

    // Explicitly resolve the migrations folder based on the current file location
    // script/migrate.ts -> ../migrations
    const migrationsFolder = path.resolve(__dirname, '../migrations');

    console.log(`Looking for migrations in: ${migrationsFolder}`);

    if (!fs.existsSync(migrationsFolder)) {
        throw new Error(`Migrations directory not found at ${migrationsFolder}. Did you run 'npm run db:generate'?`);
    }

    console.log('Running migrations...');

    try {
        await migrate(db, { migrationsFolder });
        console.log('Migrations completed successfully!');
    } catch (error) {
        console.error('Error during migration:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

runMigrations().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
