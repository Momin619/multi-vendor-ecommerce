/**
 * Centralized application error codes.
 *
 * The frontend should use these codes to understand the type
 * of error instead of depending on the exact error message.
 */
export const ERROR_CODES = {
  // =========================
  // Authentication
  // =========================

  /**
   * A user tried to register with an email
   * that already exists.
   */
  AUTH_EMAIL_EXISTS: "AUTH_EMAIL_EXISTS",

  /**
   * Email or password is incorrect during login.
   */
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",

  /**
   * No authentication credentials were provided.
   *
   * Example:
   * - accessToken cookie does not exist
   */
  AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",

  /**
   * The access token has expired.
   *
   * Frontend should attempt to call /auth/refresh.
   */
  AUTH_ACCESS_TOKEN_EXPIRED: "AUTH_ACCESS_TOKEN_EXPIRED",

  /**
   * The access token exists but is invalid.
   *
   * Examples:
   * - invalid signature
   * - malformed token
   * - wrong token structure
   */
  AUTH_ACCESS_TOKEN_INVALID: "AUTH_ACCESS_TOKEN_INVALID",

  /**
   * No refresh token was provided.
   */
  AUTH_REFRESH_TOKEN_MISSING: "AUTH_REFRESH_TOKEN_MISSING",

  /**
   * The refresh token has expired.
   *
   * The frontend cannot refresh the session anymore
   * and should require the user to log in again.
   */
  AUTH_REFRESH_TOKEN_EXPIRED: "AUTH_REFRESH_TOKEN_EXPIRED",

  /**
   * The refresh token exists but is invalid.
   *
   * Examples:
   * - invalid signature
   * - malformed token
   * - wrong token structure
   * - access token supplied instead of refresh token
   */
  AUTH_REFRESH_TOKEN_INVALID: "AUTH_REFRESH_TOKEN_INVALID",

  /**
   * The user associated with the token no longer exists.
   */
  AUTH_USER_NOT_FOUND: "AUTH_USER_NOT_FOUND",

  /**
   * The authenticated user does not have permission
   * to perform the requested operation.
   */
  AUTH_FORBIDDEN: "AUTH_FORBIDDEN",

  // =========================
  // Validation
  // =========================

  /**
   * Request body, query parameters, or other input
   * failed validation.
   */
  VALIDATION_ERROR: "VALIDATION_ERROR",

  // =========================
  // General
  // =========================

  /**
   * Requested resource does not exist.
   */
  NOT_FOUND: "NOT_FOUND",
  PRODUCT_ACCESS_DENIED : 'PRODUCT_ACCESS_DENIED',
  PRODUCT_NOT_FOUND:"PRODUCT_NOT_FOUND",
  PRODUCT_NO_CHANGES:"PRODUCT_NO_CHANGES",
  INVALID_REQUEST:"INVALID_REQUEST",
  INVALID_CURSOR :"INVALID_CURSOR",
  /**
   * Unexpected server-side error.
   */
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

/**
 * Creates a union type from the values above.
 *
 * Example:
 *
 * "AUTH_EMAIL_EXISTS"
 * | "AUTH_INVALID_CREDENTIALS"
 * | "AUTH_UNAUTHORIZED"
 * | "AUTH_ACCESS_TOKEN_EXPIRED"
 * | "AUTH_ACCESS_TOKEN_INVALID"
 * | ...
 */
export type ErrorCode =
  (typeof ERROR_CODES)[keyof typeof ERROR_CODES];