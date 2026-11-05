export const INGEST_QUEUE = 'ingest';

export type IngestJobData = {
  projectId: string;
  logIds: string[];
};
