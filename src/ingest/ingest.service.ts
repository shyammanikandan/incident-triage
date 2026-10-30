import type { LogEntryInput } from './ingest.schema.js';
import { insertLogs, type NewLog } from './ingest.repository.js';

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

  return insertLogs(rows);
}
