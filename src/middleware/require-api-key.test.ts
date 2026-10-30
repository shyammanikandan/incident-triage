import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import express from 'express';
import request from 'supertest';
import { eq } from 'drizzle-orm';
import { app } from '../app.js';
import { db, pool } from '../db/index.js';
import { apiKeys } from '../db/schema.js';
import { createProjectWithKey, resetDb } from '../test/helpers.js';
import { errorHandler } from './error-handler.js';
import { requireApiKey } from './require-api-key.js';

// A tiny app that only contains the middleware under test
const testApp = express();
testApp.get('/whoami', requireApiKey, (_req, res) => {
  res.json({ projectId: res.locals.projectId });
});
testApp.use(errorHandler);

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await pool.end();
});

describe('requireApiKey', () => {
  it('accepts a valid key and sets the projectId', async () => {
    const { projectId, key } = await createProjectWithKey();

    const res = await request(testApp)
      .get('/whoami')
      .set('Authorization', `Bearer ${key}`);

    expect(res.status).toBe(200);
    expect(res.body.projectId).toBe(projectId);
  });

  it('rejects a request with no Authorization header', async () => {
    const res = await request(testApp).get('/whoami');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('MISSING_API_KEY');
  });

  it('rejects a non-Bearer scheme', async () => {
    const res = await request(testApp)
      .get('/whoami')
      .set('Authorization', 'Basic abc123');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('MISSING_API_KEY');
  });

  it('rejects an unknown key', async () => {
    const res = await request(testApp)
      .get('/whoami')
      .set('Authorization', 'Bearer itk_doesnotexist');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_API_KEY');
  });

  it('rejects a revoked key', async () => {
    const { keyId, key } = await createProjectWithKey();
    await db
      .update(apiKeys)
      .set({ revokedAt: new Date() })
      .where(eq(apiKeys.id, keyId));

    const res = await request(testApp)
      .get('/whoami')
      .set('Authorization', `Bearer ${key}`);

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_API_KEY');
  });
});
