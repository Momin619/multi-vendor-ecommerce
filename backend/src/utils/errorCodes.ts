/**
 * Centralized application error codes.
 *
 * The frontend should use these codes to understand the type
 * of error instead of depending on the exact error message.
 */
export const ERROR_CODES = {
  // Authentication
  AUTH_EMAIL_EXISTS: "AUTH_EMAIL_EXISTS",
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_INVALID_TOKEN: "AUTH_INVALID_TOKEN",
  AUTH_TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",
  AUTH_REFRESH_TOKEN_INVALID: "AUTH_REFRESH_TOKEN_INVALID",
  AUTH_USER_NOT_FOUND: "AUTH_USER_NOT_FOUND",
  AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  AUTH_FORBIDDEN: "AUTH_FORBIDDEN",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",

  // General
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

/**
 * Creates a union type from the values above.
 *
 * Example:
 *
 * "AUTH_EMAIL_EXISTS" | "AUTH_INVALID_CREDENTIALS" | ...
 */
export type ErrorCode =
  (typeof ERROR_CODES)[keyof typeof ERROR_CODES];