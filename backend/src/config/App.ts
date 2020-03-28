import express from 'express';
import { Routes } from 'digjoy';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import errorHandler from '../middlewares/errorHandler';

import { DEBUG, PORT } from '../utils/environment';
import logger from '../utils/logger';

import '../controllers';
import bodyParser from 'body-parser';

export default class App {
  app: express.Express;

  constructor() {
    this.app = express();

    this.app.use(helmet());
    this.app.use(cors({ origin: true }));
    this.app.use(compression());
    this.app.use(morgan(DEBUG ? 'dev' : 'combined'));
    this.app.use(bodyParser.json());
    this.app.use(Routes);
    this.app.use(errorHandler);
  }

  async listen() {
    return this.app.listen(PORT, () => {
      logger.info(`Server is running. Listening on http://localhost:${PORT}`);
      logger.info('Press CTRL+C to exit');
    });
  }
}
