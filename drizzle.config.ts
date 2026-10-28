import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { defineConfig } from 'drizzle-kit';

const envFile = process.env.ENV_FILE ?? '.env';

let fileUrl: string | undefined;
try {
  const vars = parseEnv(readFileSync(envFile, 'utf8')) as Record<
    string,
    string | undefined
  >;
  fileUrl = vars.DATABASE_URL;
} catch {} // no file (e.g. in production): fall back to process.env

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: fileUrl ?? process.env.DATABASE_URL! },
});
