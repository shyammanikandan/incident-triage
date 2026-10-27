import express from 'express';
import { sql } from 'drizzle-orm';
import { db } from './db/index.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

export const app = express();
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await db.execute(sql`select 1`);

    res.json({ status: 'ok', db: 'up' });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'down' });
  }
});

// TEMPORARY: delete after testing
app.get('/boom', () => {
  throw new Error('DB password is triage_dev_pw');
});

app.use(notFoundHandler);
app.use(errorHandler);
