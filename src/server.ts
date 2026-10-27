import { app } from './app.js';
import { config } from './config.js';
import { logger } from './logger.js';

const port = Number(process.env.PORT) || 3000;
app.listen(config.PORT, () => {
  logger.info({ port: config.PORT, env: config.NODE_ENV }, 'API listening');
});
