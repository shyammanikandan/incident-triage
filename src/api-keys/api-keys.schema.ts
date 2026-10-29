import { z } from 'zod';

export const projectParamsSchema = z.object({
  projectId: z.uuid(),
});
