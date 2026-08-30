import { pool } from "../../database/pool.js";

import { AppError } from "../../utils/AppError.js";

import { ERROR_CODES } from "../../utils/errorCodes.js";

import {
  comparePassword,
  hashPassword,
} from "../../utils/password.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";

import type {
  AuthResult,
  AuthUser,
  UserRole,
} from "./auth.types.js";

import type {
  LoginInput,
  RegisterInput,
} from "./auth.schemas.js";

/**
 * Converts a database user into the public user object.
 *
 * This prevents password_hash from accidentally being sent
 * to the frontend.
 */
const mapUser = (user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}): AuthUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

/**
 * Registers a new user.
 */
export const registerUser = async (
  input: RegisterInput,
): Promise<void> => {
  const email = input.email.toLowerCase();

  const existingUser = await pool.query(
    `
      SELECT id
      FROM users
      WHERE email = $1
    `,
    [email],
  );

  if (existingUser.rowCount !== 0) {
    throw new AppError(
      "A user with this email already exists",
      409,
      ERROR_CODES.AUTH_EMAIL_EXISTS,
    );
  }

  const passwordHash = await hashPassword(
    input.password,
  );

  await pool.query(
    `
      INSERT INTO users (
        name,
        email,
        password_hash,
        role
      )
      VALUES ($1, $2, $3, $4)
    `,
    [
      input.name,
      email,
      passwordHash,
      input.role,
    ],
  );
};

/**
 * Logs an existing user in.
 */
export const loginUser = async (
  input: LoginInput,
): Promise<AuthResult> => {
  const email = input.email.toLowerCase();

  /**
   * Fetch the user including password_hash because
   * we need it for password verification.
   */
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        password_hash,
        role
      FROM users
      WHERE email = $1
    `,
    [email],
  );

  /**
   * We intentionally return the same error for a missing
   * user and incorrect password.
   *
   * This prevents attackers from discovering which emails
   * are registered.
   */
  if (result.rowCount === 0) {
    throw new AppError(
      "Invalid email or password",
      401,
      ERROR_CODES.AUTH_INVALID_CREDENTIALS,
    );
  }

  const databaseUser = result.rows[0];

  /**
   * Compare the supplied password with the stored hash.
   */
  const passwordValid = await comparePassword(
    input.password,
    databaseUser.password_hash,
  );

  if (!passwordValid) {
    throw new AppError(
      "Invalid email or password",
      401,
      ERROR_CODES.AUTH_INVALID_CREDENTIALS,
    );
  }

  const user = mapUser(databaseUser);

  const accessToken = generateAccessToken(
    user.id,
    user.role,
  );

  const refreshToken = generateRefreshToken(
    user.id,
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};

/**
 * Creates a new access token AND refresh token
 * from the existing refresh token.
 *
 * This implements refresh-token rotation.
 */
export const refreshAccessToken = async (
  input: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const payload = verifyRefreshToken(input);

  if (payload.type !== "refresh") {
    throw new AppError(
      "Invalid refresh token",
      401,
      ERROR_CODES.AUTH_REFRESH_TOKEN_INVALID,
    );
  }

  const result = await pool.query(
    `
      SELECT
        id,
        role
      FROM users
      WHERE id = $1
    `,
    [payload.userId],
  );

  if (result.rowCount === 0) {
    throw new AppError(
      "User no longer exists",
      401,
      ERROR_CODES.AUTH_USER_NOT_FOUND,
    );
  }

  const user = result.rows[0];

  const accessToken = generateAccessToken(
    user.id,
    user.role,
  );

  const refreshToken = generateRefreshToken(
    user.id,
  );

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Gets the current user's public information.
 */
export const getCurrentUser = async (
  userId: string,
): Promise<AuthUser> => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        role
      FROM users
      WHERE id = $1
    `,
    [userId],
  );

  if (result.rowCount === 0) {
    throw new AppError(
      "User not found",
      404,
      ERROR_CODES.AUTH_USER_NOT_FOUND,
    );
  }

  return mapUser(result.rows[0]);
};