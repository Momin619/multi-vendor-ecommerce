import jwt from "jsonwebtoken";
import { AppError } from "./AppError.js";
import { ERROR_CODES } from "./errorCodes.js";
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../modules/auth/auth.types.js";

import {env} from '../config/env.js';

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = env.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = env.REFRESH_TOKEN_EXPIRES_IN;

/**
 * Generate a short-lived access token.
 */
export const generateAccessToken = (
  userId: string,
  role: AccessTokenPayload["role"],
): string => {
  return jwt.sign(
    {
      userId,
      role,
      type: "access",
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  );
};

/**
 * Generate a long-lived refresh token.
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    {
      userId,
      type: "refresh",
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    },
  );
};

/**
 * Verify an access token.
 *
 * Important:
 * We specifically distinguish an expired token from
 * another invalid-token error.
 */
export const verifyAccessToken = (
  token: string,
): AccessTokenPayload => {
  try {
    return jwt.verify(
      token,
      ACCESS_TOKEN_SECRET,
    ) as AccessTokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(
        "Access token expired",
        401,
        ERROR_CODES.AUTH_ACCESS_TOKEN_EXPIRED,
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(
        "Invalid access token",
        401,
        ERROR_CODES.AUTH_ACCESS_TOKEN_INVALID,
      );
    }

    throw error;
  }
};

/**
 * Verify a refresh token.
 *
 * We distinguish an expired refresh token because
 * the frontend cannot recover from it automatically.
 */
export const verifyRefreshToken = (
  token: string,
): RefreshTokenPayload => {
  try {
    return jwt.verify(
      token,
      REFRESH_TOKEN_SECRET,
    ) as RefreshTokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(
        "Refresh token expired",
        401,
        ERROR_CODES.AUTH_REFRESH_TOKEN_EXPIRED,
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(
        "Invalid refresh token",
        401,
        ERROR_CODES.AUTH_REFRESH_TOKEN_INVALID,
      );
    }

    throw error;
  }
};