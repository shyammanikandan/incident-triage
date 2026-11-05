import type { LogEntryInput } from './ingest.schema.js';
import { insertLogs, type NewLog } from './ingest.repository.js';

import { logger } from '../logger.js';

import { enqueueIngestJob } from '../queue/ingest.queue.js';
export async function ingestLogs(
  projectId: string,
  entries: LogEntryInput[],
): Promise<number> {
  const receivedAt = new Date();

  const rows: NewLog[] = entries.map((entry) => ({
    projectId,
    level: entry.level,
    service: entry.service,
    message: entry.message,
    occurredAt: entry.timestamp ? new Date(entry.timestamp) : receivedAt,
    context: entry.context,
  }));

  const logIds = await insertLogs(rows);

  try {
    await enqueueIngestJob({ projectId, logIds });
  } catch (err) {
    logger.error(
      { err, projectId, logIds },
      'Logs stored but not queued for processing',
    );
  }

  return logIds.length;
}
