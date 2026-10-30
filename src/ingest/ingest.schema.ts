import { z } from 'zod';

export const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'] as const;

export const logEntrySchema = z.object({
  level: z.enum(LOG_LEVELS),
  service: z.string().trim().min(1).max(100),
  message: z.string().min(1).max(10_000),
  timestamp: z.iso.datetime({ offset: true }).optional(),
  context: z.record(z.string(), z.unknown()).optional(),
});

export const ingestSchema = z.object({
  logs: z.array(logEntrySchema).min(1).max(1000),
});

export type LogEntryInput = z.infer<typeof logEntrySchema>;
export type IngestInput = z.infer<typeof ingestSchema>;
