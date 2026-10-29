import type { RequestHandler } from 'express';
import { AppError } from '../errors.js';
import { hashApiKey } from '../api-keys/api-key.util.js';
import { findActiveApiKeyByHash } from '../api-keys/api-keys.repository.js';

const BEARER_PREFIX = 'Bearer ';

export const requireApiKey: RequestHandler = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith(BEARER_PREFIX)) {
    throw new AppError(
      401,
      'MISSING_API_KEY',
      "Provide an API key as 'Authorization: Bearer <key>'",
    );
  }

  const key = header.slice(BEARER_PREFIX.length).trim();
  const apiKey = await findActiveApiKeyByHash(hashApiKey(key));

  if (!apiKey) {
    throw new AppError(401, 'INVALID_API_KEY', 'Invalid or revoked API key');
  }

  res.locals.projectId = apiKey.projectId;
  next();
};
