import dotenv from "dotenv";

/**
 * Tests set NODE_ENV=test before this module is imported (see
 * tests/setup.ts), so they load `.env.test` instead of `.env` and
 * never touch the real database or send real emails.
 */
dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

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
  EMAILJS_SERVICE_ID: getRequiredEnv("EMAILJS_SERVICE_ID"),
  EMAILJS_TEMPLATE_ID: getRequiredEnv("EMAILJS_TEMPLATE_ID"),
  EMAILJS_PUBLIC_KEY: getRequiredEnv("EMAILJS_PUBLIC_KEY"),
  EMAILJS_PRIVATE_KEY: getRequiredEnv("EMAILJS_PRIVATE_KEY"),

  /**
   * Used by utils/email.ts to send password-reset OTP emails.
   

  /**
   * The "from" address for outgoing emails.
   *
   * Defaults to Resend's sandbox sender so the app still works
   * before a custom domain is verified.
   */
 

  /**
   * How long a password-reset OTP stays valid.
   */
  OTP_EXPIRES_IN_MINUTES:
    Number(process.env.OTP_EXPIRES_IN_MINUTES) || 10,
};
