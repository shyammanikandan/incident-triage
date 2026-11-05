import type { Job } from 'bullmq';
import { logger } from '../logger.js';
import type { IngestJobData } from '../queue/ingest.job.js';
import { findLogsByIds } from './ingest.repository.js';

export async function processIngestJob(job: Job<IngestJobData>) {
  const { projectId, logIds } = job.data;

  const logs = await findLogsByIds(projectId, logIds);

  logger.info(
    {
      jobId: job.id,
      projectId,
      expected: logIds.length,
      loaded: logs.length,
    },
    'Processed ingest job',
  );

  return { processed: logs.length };
}
