import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors.js';

// Unknown routes become a 404 AppError
export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(
    new AppError(404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`),
  );
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .json({ error: { code: err.code, message: err.message } });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request',
        details: err.issues,
      },
    });
    return;
  }

  if ((err as { type?: string }).type === 'entity.parse.failed') {
    res.status(400).json({
      error: { code: 'INVALID_JSON', message: 'Malformed JSON body' },
    });
    return;
  }

  // Anything else is a bug: log the details, hide them from the client
  req.log.error({ err }, 'Unhandled error');
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
  });
};
