import { sql } from 'drizzle-orm';
import { db } from '../db/index.js';

export async function resetDb() {
  await db.execute(sql`TRUNCATE TABLE projects CASCADE`);
}
