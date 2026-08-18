import type { CookieOptions } from "express";
import { env } from "./env.js";

/**
 * Options shared by authentication cookies.
 */
const commonAuthCookieOptions: CookieOptions = {
  /**
   * Prevent JavaScript from accessing the token.
   */
  httpOnly: true,

  /**
   * Require HTTPS in production.
   */
  secure: env.NODE_ENV === "production",

  /**
   * CSRF protection.
   */
  sameSite:
    env.NODE_ENV === "production"
      ? "strict"
      : "lax",
};

/**
 * Access token configuration.
 *
 * Short-lived token.
 *
 * Available for all API requests.
 */
export const accessTokenCookieOptions: CookieOptions = {
  ...commonAuthCookieOptions,

  maxAge: 15 * 60 * 1000,

  path: "/",
};

/**
 * Refresh token configuration.
 *
 * Long-lived token.
 *
 * Only required by authentication routes.
 */
export const refreshTokenCookieOptions: CookieOptions = {
  ...commonAuthCookieOptions,

  maxAge: 7 * 24 * 60 * 60 * 1000,

  path: "/",
};