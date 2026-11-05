import { and, eq, inArray } from 'drizzle-orm';

import { db } from '../db/index.js';
import { logs } from '../db/schema.js';

export type NewLog = typeof logs.$inferInsert;
export type Log = typeof logs.$inferSelect;

export async function insertLogs(rows: NewLog[]): Promise<string[]> {
  const inserted = await db
    .insert(logs)
    .values(rows)
    .returning({ id: logs.id });
  return inserted.map((row) => row.id);
}

export async function findLogsByIds(
  projectId: string,
  logIds: string[],
): Promise<Log[]> {
  return db
    .select()
    .from(logs)
    .where(and(eq(logs.projectId, projectId), inArray(logs.id, logIds)));
}
