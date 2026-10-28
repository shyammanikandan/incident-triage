import { defineConfig } from 'vitest/config';

try {
  process.loadEnvFile('.env.test');
} catch {} // gives tests DATABASE_URL

export default defineConfig({
  test: {
    env: {
      NODE_ENV: 'test',
      LOG_LEVEL: 'silent',
    },
  },
});
