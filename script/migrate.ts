import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as schema from '../shared/schema';

async function runMigrations() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    const db = drizzle(pool, { schema });

    console.log('Running migrations...');

    await migrate(db, { migrationsFolder: './migrations' });

    console.log('Migrations completed successfully!');

    await pool.end();
    process.exit(0);
}

runMigrations().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
