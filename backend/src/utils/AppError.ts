import type { ErrorCode } from "./errorCodes.js";

/**
 * Custom application error.
 *
 * We use this instead of normal Error objects because every
 * API error needs:
 *
 * - HTTP status code
 * - readable message
 * - application-specific error code
 */
export class AppError extends Error {
  public readonly statusCode: number;

  public readonly errorCode: ErrorCode;

  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCode,
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}