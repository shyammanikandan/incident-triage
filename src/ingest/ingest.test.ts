import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { eq } from 'drizzle-orm';
import { app } from '../app.js';
import { db, pool } from '../db/index.js';
import { logs } from '../db/schema.js';
import { createProjectWithKey, resetDb } from '../test/helpers.js';

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await pool.end();
});

const validLog = {
  level: 'error',
  service: 'payments',
  message: 'Card provider timeout',
};

function ingest(key: string | null, body: object) {
  const req = request(app).post('/ingest');
  if (key) req.set('Authorization', `Bearer ${key}`);
  return req.send(body);
}

describe('POST /ingest', () => {
  it("accepts a valid batch and stores it under the key's project", async () => {
    const { projectId, key } = await createProjectWithKey();

    const res = await ingest(key, {
      logs: [validLog, { ...validLog, level: 'warn' }],
    });

    expect(res.status).toBe(202);
    expect(res.body).toEqual({ accepted: 2 });

    const rows = await db
      .select()
      .from(logs)
      .where(eq(logs.projectId, projectId));
    expect(rows).toHaveLength(2);
  });

  it('fills occurredAt with the receive time when timestamp is missing', async () => {
    const { key } = await createProjectWithKey();
    const before = Date.now();

    await ingest(key, { logs: [validLog] });

    const [row] = await db.select().from(logs);
    expect(row.occurredAt.getTime()).toBeGreaterThanOrEqual(before);
  });

  it("keeps the app's timestamp when provided", async () => {
    const { key } = await createProjectWithKey();

    await ingest(key, {
      logs: [{ ...validLog, timestamp: '2026-01-01T00:00:00Z' }],
    });

    const [row] = await db.select().from(logs);
    expect(row.occurredAt.toISOString()).toBe('2026-01-01T00:00:00.000Z');
  });

  it('rejects requests without an API key and stores nothing', async () => {
    const res = await ingest(null, { logs: [validLog] });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('MISSING_API_KEY');

    const rows = await db.select().from(logs);
    expect(rows).toHaveLength(0);
  });

  it('rejects an invalid level', async () => {
    const { key } = await createProjectWithKey();

    const res = await ingest(key, { logs: [{ ...validLog, level: 'panic' }] });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects an empty batch', async () => {
    const { key } = await createProjectWithKey();

    const res = await ingest(key, { logs: [] });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
