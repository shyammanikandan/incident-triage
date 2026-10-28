import { app } from './app.js';
import { config } from './config.js';
import { logger } from './logger.js';

app.listen(config.PORT, (error?: Error) => {
  if (error) {
    logger.fatal({ err: error }, 'Failed to start server');
    process.exit(1);
  }
  logger.info({ port: config.PORT, env: config.NODE_ENV }, 'API listening');
});
