import { defineConfig } from 'drizzle-kit';

try {
  process.loadEnvFile();
} catch {} // loads .env locally; skipped if absent

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
