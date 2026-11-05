import { Redis, type RedisOptions } from 'ioredis';

import { config } from '../config.js';

export function createRedisConnection(options: RedisOptions): Redis {
  return new Redis(config.REDIS_URL, options);
}
