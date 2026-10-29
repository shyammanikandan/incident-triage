import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { pool } from '../db/index.js';
import { resetDb } from '../test/helpers.js';

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await pool.end();
});

describe('POST /projects', () => {
  it('creates a project and trims the name', async () => {
    const res = await request(app).post('/projects').send({ name: '  shop  ' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('shop');
    expect(res.body.id).toEqual(expect.any(String));
    expect(res.body.createdAt).toEqual(expect.any(String));
  });

  it('returns 409 when the name already exists', async () => {
    await request(app).post('/projects').send({ name: 'shop' });
    const res = await request(app).post('/projects').send({ name: 'shop' });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('PROJECT_NAME_TAKEN');
  });

  it('returns 400 for an empty name', async () => {
    const res = await request(app).post('/projects').send({ name: '' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /projects', () => {
  it('lists projects newest first', async () => {
    await request(app).post('/projects').send({ name: 'a' });
    await request(app).post('/projects').send({ name: 'b' });

    const res = await request(app).get('/projects');

    expect(res.status).toBe(200);
    expect(res.body.data.map((p: { name: string }) => p.name)).toEqual([
      'b',
      'a',
    ]);
  });
});
