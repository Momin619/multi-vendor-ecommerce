import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

import type {
  AccessTokenPayload,
  RefreshTokenPayload,
  UserRole,
} from "../modules/auth/auth.types.js";

/**
 * Generates an access token.
 *
 * Access tokens are short-lived.
 */
export const generateAccessToken = (
  userId: string,
  role: UserRole,
): string => {
  const payload: AccessTokenPayload = {
    userId,
    role,
    type: "access",
  };

  return jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    },
  );
};

/**
 * Generates a refresh token.
 *
 * This token is NOT stored in PostgreSQL.
 */
export const generateRefreshToken = (
  userId: string,
): string => {
  const payload: RefreshTokenPayload = {
    userId,
    type: "refresh",
  };

  return jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    {
      expiresIn:
        env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    },
  );
};

/**
 * Verifies an access token.
 */
export const verifyAccessToken = (
  token: string,
): AccessTokenPayload => {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET,
  ) as AccessTokenPayload;
};

/**
 * Verifies a refresh token.
 */
export const verifyRefreshToken = (
  token: string,
): RefreshTokenPayload => {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET,
  ) as RefreshTokenPayload;
};