import { defineConfig } from "drizzle-kit";

// Use fallback URL if DATABASE_URL is somehow missing from .env
const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/dine_db";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});
