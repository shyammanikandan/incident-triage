import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { createProjectSchema } from './projects.schema.js';
import {
  createProjectHandler,
  listProjectsHandler,
} from './projects.controller.js';

export const projectsRouter = Router();

projectsRouter.post('/', validate(createProjectSchema), createProjectHandler);
projectsRouter.get('/', listProjectsHandler);
