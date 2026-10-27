import { app } from './app.js';
import { config } from './config.js';

const port = Number(process.env.PORT) || 3000;
app.listen(config.PORT, () => {
  console.log(`API listening on port ${config.PORT} (${config.NODE_ENV})`);
});
