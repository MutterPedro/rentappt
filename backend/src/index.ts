import 'reflect-metadata';

import App from './config/App';
import { init as initializeModels } from './models';

(async function index() {
  await initializeModels();
  await new App().listen();
})();
