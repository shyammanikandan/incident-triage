import { desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { apiKeys } from '../db/schema.js';

export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;

export async function insertApiKey(data: NewApiKey): Promise<ApiKey> {
  const [apiKey] = await db.insert(apiKeys).values(data).returning();
  return apiKey;
}

export async function findApiKeysByProject(projectId: string) {
  return db
    .select({
      id: apiKeys.id,
      prefix: apiKeys.keyPrefix,
      createdAt: apiKeys.createdAt,
      revokedAt: apiKeys.revokedAt,
    })
    .from(apiKeys)
    .where(eq(apiKeys.projectId, projectId))
    .orderBy(desc(apiKeys.createdAt));
}
