import "dotenv/config";

/**
 * Returns an environment variable or throws an error
 * if the variable does not exist.
 */
const getRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

/**
 * Centralized application configuration.
 *
 * Other files should use `env` instead of directly accessing
 * process.env.
 */
export const env = {
  PORT: Number(process.env.PORT) || 5000,

  NODE_ENV: process.env.NODE_ENV || "development",

  DATABASE_URL: getRequiredEnv("DATABASE_URL"),

  JWT_ACCESS_SECRET: getRequiredEnv("JWT_ACCESS_SECRET"),

  JWT_REFRESH_SECRET: getRequiredEnv("JWT_REFRESH_SECRET"),

  JWT_ACCESS_EXPIRES_IN:
    process.env.JWT_ACCESS_EXPIRES_IN || "15m",

  JWT_REFRESH_EXPIRES_IN:
    process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};