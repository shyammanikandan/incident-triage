import { AppError } from '../errors.js';
import { findProjectById } from '../projects/projects.repository.js';
import { generateApiKey } from './api-key.util.js';
import { findApiKeysByProject, insertApiKey } from './api-keys.repository.js';

async function ensureProjectExists(projectId: string): Promise<void> {
  const project = await findProjectById(projectId);
  if (!project) {
    throw new AppError(404, 'PROJECT_NOT_FOUND', 'Project not found');
  }
}

export async function createApiKey(projectId: string) {
  await ensureProjectExists(projectId);

  const { key, prefix, hash } = generateApiKey();
  const row = await insertApiKey({
    projectId,
    keyHash: hash,
    keyPrefix: prefix,
  });

  return { id: row.id, key, prefix, createdAt: row.createdAt };
}

export async function listApiKeys(projectId: string) {
  await ensureProjectExists(projectId);
  return findApiKeysByProject(projectId);
}
