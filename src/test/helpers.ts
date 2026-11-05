import { sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import request from 'supertest';
import { app } from '../app.js';
import { pool } from '../db/index.js';
import { ingestQueue } from '../queue/ingest.queue.js';

export async function resetDb() {
  await db.execute(sql`TRUNCATE TABLE projects CASCADE`);
}

export async function closeConnections() {
  await ingestQueue.close();
  await pool.end();
}

export async function createProjectWithKey(name = 'test-project') {
  const project = await request(app).post('/projects').send({ name });
  const apiKey = await request(app).post(
    `/projects/${project.body.id}/api-keys`,
  );

  return {
    projectId: project.body.id as string,
    keyId: apiKey.body.id as string,
    key: apiKey.body.key as string,
  };
}
