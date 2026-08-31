import { pool } from "../../database/pool.js";

import { AppError } from "../../utils/AppError.js";

import { ERROR_CODES } from "../../utils/errorCodes.js";

import {
  comparePassword,
  hashPassword,
} from "../../utils/password.js";

import {
  generateOtp,
  hashOtp,
  compareOtp,
} from "../../utils/otp.js";

import { sendPasswordResetOtpEmail } from "../../utils/email.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";

import { env } from "../../config/env.js";

import type {
  AuthResult,
  AuthUser,
  UserRole,
} from "./auth.types.js";

import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./auth.schemas.js";

/**
 * Maximum number of incorrect OTP guesses allowed
 * before the code is rejected outright.
 */
const MAX_OTP_ATTEMPTS = 5;

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

/**
 * Requests a password-reset OTP for the given email.
 *
 * This always resolves successfully — even when the email
 * doesn't belong to any account — so the endpoint can't be
 * used to check which emails are registered. The controller
 * always returns the same generic message.
 */
export const requestPasswordResetOtp = async (
  input: ForgotPasswordInput,
): Promise<void> => {
  const email = input.email.toLowerCase();

  const userResult = await pool.query(
    `
      SELECT id
      FROM users
      WHERE email = $1
    `,
    [email],
  );

  /**
   * Silently no-op for unknown emails instead of throwing.
   */
  if (userResult.rowCount === 0) {
    return;
  }

  const userId = userResult.rows[0].id;

  const otp = generateOtp();
  const otpHash = hashOtp(otp);

  const expiresAt = new Date(
    Date.now() + env.OTP_EXPIRES_IN_MINUTES * 60 * 1000,
  );

  /**
   * Invalidate any previous, still-usable OTPs for this user
   * so only the most recently requested code is ever valid.
   * Without this, an old email sitting in someone's inbox
   * would still work after they requested a newer code.
   */
  await pool.query(
    `
      DELETE FROM password_reset_otps
      WHERE user_id = $1
        AND consumed_at IS NULL
    `,
    [userId],
  );

  await pool.query(
    `
      INSERT INTO password_reset_otps (
        user_id,
        otp_hash,
        expires_at
      )
      VALUES ($1, $2, $3)
    `,
    [userId, otpHash, expiresAt],
  );

  await sendPasswordResetOtpEmail(email, otp);
};

/**
 * Verifies a password-reset OTP and, if valid, sets the new password.
 */
export const resetPasswordWithOtp = async (
  input: ResetPasswordInput,
): Promise<void> => {
  const email = input.email.toLowerCase();

  const userResult = await pool.query(
    `
     SELECT id, password_hash
    FROM users
    WHERE email = $1
    `,
    [email],
  );

  /**
   * Same generic error as an invalid OTP.
   *
   * If we said "no account with this email" here, an attacker
   * could use this endpoint to enumerate registered emails.
   */
  if (userResult.rowCount === 0) {
    throw new AppError(
      "Invalid or expired code",
      400,
      ERROR_CODES.AUTH_OTP_INVALID,
    );
  }

  const userId = userResult.rows[0].id;

  const otpResult = await pool.query(
    `
      SELECT
        id,
        otp_hash,
        attempts,
        expires_at
      FROM password_reset_otps
      WHERE user_id = $1
        AND consumed_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [userId],
  );

  if (otpResult.rowCount === 0) {
    throw new AppError(
      "Invalid or expired code",
      400,
      ERROR_CODES.AUTH_OTP_INVALID,
    );
  }

  const otpRow = otpResult.rows[0];

  const isExpired =
    new Date(otpRow.expires_at).getTime() < Date.now();

  if (isExpired) {
    throw new AppError(
      "This code has expired. Please request a new one.",
      400,
      ERROR_CODES.AUTH_OTP_EXPIRED,
    );
  }

  if (otpRow.attempts >= MAX_OTP_ATTEMPTS) {
    throw new AppError(
      "Too many incorrect attempts. Please request a new code.",
      429,
      ERROR_CODES.AUTH_OTP_TOO_MANY_ATTEMPTS,
    );
  }

  const isOtpValid = compareOtp(
    input.otp,
    otpRow.otp_hash,
  );

  if (!isOtpValid) {
    /**
     * Record the failed attempt so repeated guessing
     * eventually locks the code out entirely.
     */
    await pool.query(
      `
        UPDATE password_reset_otps
        SET attempts = attempts + 1
        WHERE id = $1
      `,
      [otpRow.id],
    );

    throw new AppError(
      "Invalid or expired code",
      400,
      ERROR_CODES.AUTH_OTP_INVALID,
    );
  }

const isSamePassword = await comparePassword(
  input.newPassword,
  userResult.rows[0].password_hash,
);

if (isSamePassword) {
  throw new AppError(
    "New password cannot be the same as your current password",
    400,
    ERROR_CODES.AUTH_NEW_PASSWORD_SAME,
  );
}

  const passwordHash = await hashPassword(
    input.newPassword,
  );

  /**
   * Update the password and consume the OTP together so we
   * never end up in a state where the password changed but
   * the code could still be reused (or vice versa).
   */
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        UPDATE users
        SET
          password_hash = $1,
          updated_at = NOW()
        WHERE id = $2
      `,
      [passwordHash, userId],
    );

    await client.query(
      `
        UPDATE password_reset_otps
        SET consumed_at = NOW()
        WHERE id = $1
      `,
      [otpRow.id],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
