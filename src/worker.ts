import { Worker } from 'bullmq';
import { pool } from './db/index.js';
import { processIngestJob } from './ingest/ingest.processor.js';
import { logger } from './logger.js';
import { INGEST_QUEUE, type IngestJobData } from './queue/ingest.job.js';
import { createRedisConnection } from './queue/redis.js';

const worker = new Worker<IngestJobData>(INGEST_QUEUE, processIngestJob, {
  connection: createRedisConnection({ maxRetriesPerRequest: null }),
  concurrency: 5,
});

worker.on('ready', () => logger.info({ queue: INGEST_QUEUE }, 'Worker ready'));
worker.on('failed', (job, err) =>
  logger.error(
    { jobId: job?.id, attempt: job?.attemptsMade, err },
    'Job failed',
  ),
);

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down worker');
  await worker.close();
  await pool.end();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
