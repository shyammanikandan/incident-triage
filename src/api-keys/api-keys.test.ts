import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { eq } from 'drizzle-orm';
import { app } from '../app.js';
import { db, pool } from '../db/index.js';
import { apiKeys } from '../db/schema.js';
import { resetDb } from '../test/helpers.js';
import { hashApiKey } from './api-key.util.js';

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await pool.end();
});

async function createTestProject(): Promise<string> {
  const res = await request(app)
    .post('/projects')
    .send({ name: 'test-project' });
  return res.body.id;
}

describe('POST /projects/:projectId/api-keys', () => {
  it('creates a key and returns it once', async () => {
    const projectId = await createTestProject();
    const res = await request(app).post(`/projects/${projectId}/api-keys`);

    expect(res.status).toBe(201);
    expect(res.body.key).toMatch(/^itk_/);
    expect(res.body.prefix).toBe(res.body.key.slice(0, 8));
    expect(res.headers['cache-control']).toBe('no-store');
  });

  it('stores only the hash, never the raw key', async () => {
    const projectId = await createTestProject();
    const res = await request(app).post(`/projects/${projectId}/api-keys`);
    const { key } = res.body;

    const [row] = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.id, res.body.id));

    expect(row.keyHash).toBe(hashApiKey(key));
    expect(Object.values(row)).not.toContain(key);
  });

  it('returns 400 for an invalid project id', async () => {
    const res = await request(app).post('/projects/abc/api-keys');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 404 when the project does not exist', async () => {
    const res = await request(app).post(
      '/projects/00000000-0000-4000-8000-000000000000/api-keys',
    );

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('PROJECT_NOT_FOUND');
  });
});

describe('GET /projects/:projectId/api-keys', () => {
  it('lists keys without exposing secrets', async () => {
    const projectId = await createTestProject();
    await request(app).post(`/projects/${projectId}/api-keys`);

    const res = await request(app).get(`/projects/${projectId}/api-keys`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(Object.keys(res.body.data[0]).sort()).toEqual([
      'createdAt',
      'id',
      'prefix',
      'revokedAt',
    ]);
  });
});
