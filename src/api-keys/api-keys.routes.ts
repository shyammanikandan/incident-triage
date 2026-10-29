import { Router } from 'express';
import {
  createApiKeyHandler,
  listApiKeysHandler,
} from './api-keys.controller.js';

export const apiKeysRouter = Router({ mergeParams: true });

apiKeysRouter.post('/', createApiKeyHandler);
apiKeysRouter.get('/', listApiKeysHandler);
