import type { Request, Response } from 'express';
import { createProject, listProjects } from './projects.service.js';
import type { CreateProjectInput } from './projects.schema.js';

export async function createProjectHandler(req: Request, res: Response) {
  const input = req.body as CreateProjectInput;
  req.log.debug({ name: input.name }, 'Creating project');
  const project = await createProject(input);
  res.status(201).json(project);
}

export async function listProjectsHandler(_req: Request, res: Response) {
  const projects = await listProjects();
  res.json({ data: projects });
}
