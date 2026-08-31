import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  loginUser,
  registerUser,
  refreshAccessToken,
  getCurrentUser,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
} from "./auth.service.js";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../../config/cookie.js";
import { sendSuccess } from "../../utils/response.js";
import { AppError } from "../../utils/AppError.js";
import { ERROR_CODES } from "../../utils/errorCodes.js";
/**
 * Register controller.
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await registerUser(req.body);

    sendSuccess(
      res,
      "Registration successful",
      null,
      201,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login controller.
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await loginUser(req.body);

    /**
     * Store short-lived access token.
     */
    res.cookie(
      "accessToken",
      result.accessToken,
      accessTokenCookieOptions,
    );

    /**
     * Store long-lived refresh token.
     */
    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshTokenCookieOptions,
    );

    /**
     * We don't need to return either token in JSON
     * because both are already stored in HTTP-only cookies.
     *
     * Returning the user is enough for the frontend
     * to update its authentication state.
     */
    sendSuccess(
      res,
      "Login successful",
      {
        user: result.user,
      },
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh-token controller.
 *
 * Generates a new access token AND rotates
 * the refresh token.
 */
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    /**
     * Get the current refresh token from
     * the HTTP-only cookie.
     */
    const refreshToken =
      req.cookies.refreshToken;

    /**
     * A refresh request cannot continue
     * without a refresh token.
     */
    if (!refreshToken) {
      throw new AppError(
        "Refresh token not found",
        401,
        ERROR_CODES.AUTH_REFRESH_TOKEN_MISSING,
      );
    }

    /**
     * Verify the old refresh token and
     * generate both new tokens.
     */
    const result =
      await refreshAccessToken(refreshToken);

    /**
     * Replace the old access token.
     */
    res.cookie(
      "accessToken",
      result.accessToken,
      accessTokenCookieOptions,
    );

    /**
     * Replace the old refresh token.
     *
     * This is refresh-token rotation.
     */
    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshTokenCookieOptions,
    );

    /**
     * Tokens are stored in HTTP-only cookies,
     * so there is no reason to return them
     * in the JSON response.
     */
    sendSuccess(
      res,
      "Tokens refreshed successfully",
      null,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Returns the currently authenticated user.
 */
export const me = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    /**
     * auth.middleware attaches req.user.
     */
    const user = await getCurrentUser(
      req.user!.userId,
    );

    sendSuccess(
      res,
      "Current user retrieved successfully",
      {
        user,
      },
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Logout controller.
 */
export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    /**
     * Clear the access token.
     *
     * This uses path: "/"
     * because that is how the access token
     * cookie was originally created.
     */
    res.clearCookie(
      "accessToken",
      accessTokenCookieOptions,
    );

    /**
     * Clear the refresh token.
     *
     * This uses path: "/api/auth"
     * because that is how the refresh token
     * cookie was originally created.
     */
    res.clearCookie(
      "refreshToken",
      refreshTokenCookieOptions,
    );

    sendSuccess(
      res,
      "Logout successful",
      null,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot-password controller.
 *
 * Requests a password-reset OTP to be emailed to the user.
 */
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    console.log(req.body)
    await requestPasswordResetOtp(req.body);

    /**
     * Always return the same message whether or not the
     * email belongs to an account — see auth.service.ts.
     */
    sendSuccess(
      res,
      "If that email is registered, a reset code has been sent.",
      null,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Reset-password controller.
 *
 * Verifies the OTP and sets the new password.
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await resetPasswordWithOtp(req.body);

    sendSuccess(
      res,
      "Password reset successfully. Please log in.",
      null,
    );
  } catch (error) {
    next(error);
  }
};
