import { desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { projects } from '../db/schema.js';
import type { CreateProjectInput } from './projects.schema.js';

export type Project = typeof projects.$inferSelect;

export async function insertProject(
  input: CreateProjectInput,
): Promise<Project> {
  const [project] = await db.insert(projects).values(input).returning();
  return project;
}

export async function findAllProjects(): Promise<Project[]> {
  return db.select().from(projects).orderBy(desc(projects.createdAt));
}
