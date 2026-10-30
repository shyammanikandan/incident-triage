import type { Request, Response } from 'express';
import type { IngestInput } from './ingest.schema.js';
import { ingestLogs } from './ingest.service.js';

export async function ingestHandler(req: Request, res: Response) {
  const { logs } = req.body as IngestInput;
  const projectId = res.locals.projectId as string;

  const accepted = await ingestLogs(projectId, logs);
  res.status(202).json({ accepted });
}
