import { AppError } from '../errors.js';
import {
  findAllProjects,
  insertProject,
  type Project,
} from './projects.repository.js';
import type { CreateProjectInput } from './projects.schema.js';

const UNIQUE_VIOLATION = '23505';

function isUniqueViolation(err: unknown): boolean {
  const e = err as { code?: string; cause?: { code?: string } };
  return e?.code === UNIQUE_VIOLATION || e?.cause?.code === UNIQUE_VIOLATION;
}

export async function createProject(
  input: CreateProjectInput,
): Promise<Project> {
  try {
    return await insertProject(input);
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new AppError(
        409,
        'PROJECT_NAME_TAKEN',
        'A project with this name already exists',
      );
    }
    throw err;
  }
}

export function listProjects(): Promise<Project[]> {
  return findAllProjects();
}
