import { db } from '../db/index.js';
import { logs } from '../db/schema.js';

export type NewLog = typeof logs.$inferInsert;

export async function insertLogs(rows: NewLog[]): Promise<string[]> {
  const inserted = await db
    .insert(logs)
    .values(rows)
    .returning({ id: logs.id });
  return inserted.map((row) => row.id);
}
