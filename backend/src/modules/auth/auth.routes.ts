import { Router } from "express";

import {
  register,
  login,
  refresh,
  logout,
  me,
  forgotPassword,
  resetPassword,
} from "./auth.controller.js";

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schemas.js";

import {
  validate
} from "../../middlewares/validate.middleware.js";

import {
  authenticate,
} from "../../middlewares/auth.middleware.js";

import {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
} from "../../middlewares/token-bucket.middleware.js";

const authRouter = Router();

/**
 * POST /api/auth/register
 *
 * Creates a new customer/seller account.
 */
authRouter.post(
  "/register",
  registerLimiter,
  validate(registerSchema, "body"),
  register,
);

/**
 * POST /api/auth/login
 *
 * Authenticates an existing user.
 */
authRouter.post(
  "/login",
  loginLimiter,
  validate(loginSchema, "body"),
  login
);

/**
 * POST /api/auth/refresh
 *
 * Generates a new access token using the HTTP-only
 * refresh-token cookie.
 */
authRouter.post(
  "/refresh",
  refresh,
);

/**
 * POST /api/auth/logout
 *
 * Clears the refresh-token cookie.
 */
authRouter.post(
  "/logout",
  authenticate,
  logout,
);

/**
 * GET /api/auth/me
 *
 * Returns the authenticated user.
 */
authRouter.get(
  "/me",
  authenticate,
  me,
);

/**
 * POST /api/auth/forgot-password
 *
 * Emails a 6-digit OTP to the given address, if it belongs
 * to an account. Always responds the same way either way.
 */
authRouter.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validate(forgotPasswordSchema, "body"),
  forgotPassword,
);

/**
 * POST /api/auth/reset-password
 *
 * Verifies the OTP and sets a new password.
 */
authRouter.post(
  "/reset-password",
  resetPasswordLimiter,
  validate(resetPasswordSchema, "body"),
  resetPassword,
);

export default authRouter;
