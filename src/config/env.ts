import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const defaultEnvPath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(defaultEnvPath)) {
  console.log(`Loading environment file: ${defaultEnvPath}`);
  dotenv.config({ path: defaultEnvPath });
} else {
  console.error('No .env file found! Please create one to set environment variables.');
  process.exit(1);
}

export const APP_ENV = process.env.APP_ENV || 'development';
export const APP_HOST = process.env.APP_HOST || "localhost";
export const APP_PORT = process.env.APP_PORT || "3000";
export const APP_API_PREFIX = process.env.APP_API_PREFIX || "/api";

// Database
export const DB_CONFIG = {
  db_user: process.env["DB_USER"] || "root",
  db_password: process.env["DB_PASSWORD"] || "root",
  db_name: process.env["DB_NAME"] || "db_local",
  config: {
    host: process.env["DB_HOST"] || "localhost",
    port: process.env["DB_PORT"] || "5432",
    dialect: process.env["DB_DIALECT"] || "postgres",
  },
};

// json web token
export const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY || "secret@ts_express4321";
if(!JWT_REFRESH_SECRET_KEY) {
  console.log("JWT_REFRESH_SECRET_KEY is not defined");
  process.exit(1);
}
export const JWT_REFRESH_SECRET_TTL = process.env.JWT_REFRESH_SECRET_TTL || "7d";

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "secret@ts_express4321";
if(!JWT_SECRET_KEY) {
  console.log("JWT_SECRET_KEY is not defined");
  process.exit(1);
}
export const JWT_SECRET_KEY_TTL = process.env.JWT_SECRET_TTL || "10m";
