import dotenv from 'dotenv';
import fs from 'fs';

export const APP_ENV = process.env.APP_ENV || 'development';

let configPath = `@/.env`;
try {
  fs.readFileSync(configPath);
} catch (error) {
  configPath = `./../../.env.${APP_ENV}`;
}
dotenv.config({ override: true, path: configPath });

export const APP_HOST = process.env.APP_HOST || "localhost";
export const APP_PORT = process.env.APP_PORT || "3000";
export const APP_API_PREFIX = process.env.APP_API_PREFIX || "/api";
