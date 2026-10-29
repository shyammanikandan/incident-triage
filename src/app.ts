import express from 'express';
import { pinoHttp } from 'pino-http';
import { randomUUID } from 'node:crypto';
import { logger } from './logger.js';
import { sql } from 'drizzle-orm';
import { db } from './db/index.js';
import { apiKeysRouter } from './api-keys/api-keys.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { projectsRouter } from './projects/projects.routes.js';

export const app = express();
app.use(
  pinoHttp({
    logger,
    genReqId: (req, res) => {
      const incoming = req.headers['x-request-id'];
      const id = typeof incoming === 'string' ? incoming : randomUUID();
      res.setHeader('x-request-id', id);
      return id;
    },
  }),
);
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.json({ status: 'ok', db: 'up' });
  } catch (err) {
    req.log.error({ err }, 'Health check: database query failed');
    res.status(503).json({ status: 'degraded', db: 'down' });
  }
});

app.use('/projects', projectsRouter);

app.use('/projects/:projectId/api-keys', apiKeysRouter);
app.get('/boom', () => {
  throw new Error('test failure');
});
app.use(notFoundHandler);
app.use(errorHandler);
