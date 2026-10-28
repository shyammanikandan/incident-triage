import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { config } from '../config.js';

export const pool = new pg.Pool({
  connectionString: config.DATABASE_URL,
  max: 10, // at most 10 connections in the pool
  connectionTimeoutMillis: 5000, // give up connecting after 5s
  query_timeout: 10000, // give up on a query after 10s
});

export const db = drizzle({ client: pool });
