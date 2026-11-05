import { Queue } from 'bullmq';
import { createRedisConnection } from './redis.js';
import { INGEST_QUEUE, type IngestJobData } from './ingest.job.js';

export const ingestQueue = new Queue<IngestJobData>(INGEST_QUEUE, {
  connection: createRedisConnection({ enableOfflineQueue: false }),
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { count: 1000 },
    removeOnFail: { age: 7 * 24 * 60 * 60 },
  },
});
export async function enqueueIngestJob(data: IngestJobData): Promise<void> {
  await ingestQueue.add('process-logs', data);
}
