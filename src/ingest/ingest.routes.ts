import { Router } from 'express';

import { requireApiKey } from '../middleware/require-api-key.js';
import { validate } from '../middleware/validate.js';
import { ingestSchema } from './ingest.schema.js';

import { ingestHandler } from './ingest.controller.js';

export const ingestRouter = Router();

ingestRouter.post('/', requireApiKey, validate(ingestSchema), ingestHandler);
