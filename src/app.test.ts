import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';

import { closeConnections } from './test/helpers.js';
import { app } from './app.js';

afterAll(async () => {
  await closeConnections();
});
describe('GET /health', () => {
  it('returns ok when the database is up', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', db: 'up' });
  });
});
