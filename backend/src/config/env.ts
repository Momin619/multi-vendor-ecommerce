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

  ACCESS_TOKEN_SECRET: getRequiredEnv("ACCESS_TOKEN_SECRET"),

  REFRESH_TOKEN_SECRET: getRequiredEnv("REFRESH_TOKEN_SECRET"),

  ACCESS_TOKEN_EXPIRES_IN:
    process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",

  REFRESH_TOKEN_EXPIRES_IN:
    process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",

  CLOUDINARY_CLOUD_NAME: getRequiredEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getRequiredEnv("CLOUDINARY_API_KEY"),
};