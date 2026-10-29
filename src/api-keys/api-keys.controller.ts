import type { Request, Response } from 'express';
import { projectParamsSchema } from './api-keys.schema.js';
import { createApiKey, listApiKeys } from './api-keys.service.js';

export async function createApiKeyHandler(req: Request, res: Response) {
  const { projectId } = projectParamsSchema.parse(req.params);
  const apiKey = await createApiKey(projectId);

  res.set('Cache-Control', 'no-store');
  res.status(201).json(apiKey);
}

export async function listApiKeysHandler(req: Request, res: Response) {
  const { projectId } = projectParamsSchema.parse(req.params);
  const apiKeys = await listApiKeys(projectId);

  res.json({ data: apiKeys });
}
