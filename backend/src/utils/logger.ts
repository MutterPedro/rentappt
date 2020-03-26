import pino from 'pino';

import { DEBUG } from './environment';

const logger = pino({ prettyPrint: DEBUG ? { colorize: true } : undefined });

export default logger;
