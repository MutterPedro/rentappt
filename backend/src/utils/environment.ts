import * as dotenv from 'dotenv';
import * as fs from 'fs';

import { requiredEnvVar } from './required';

if (fs.existsSync('.env')) {
  console.debug('🧩  Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
}

export const ENV = process.env.NODE_ENV;
export const DEBUG = ENV !== 'production';
export const PORT = Number(process.env.PORT || 3000);

export const DB_HOST = process.env.DB_HOST || requiredEnvVar('DB_HOST');
export const DB_USER = process.env.DB_USER || requiredEnvVar('DB_USER');
export const DB_NAME = process.env.DB_NAME || requiredEnvVar('DB_NAME');
export const DB_PASSWORD = process.env.DB_PASSWORD || requiredEnvVar('DB_PASSWORD');

export const JWT_SALT = process.env.JWT_SALT || requiredEnvVar('JWT_SALT');
