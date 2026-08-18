import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";
import { ZodError } from "zod";

import { AppError } from "../utils/AppError.js";
import { ERROR_CODES } from "../utils/errorCodes.js";

/**
 * Standard API error response.
 */
interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode: string;
  errors?: unknown;
}

/**
 * Global error-handling middleware.
 *
 * Every error thrown inside controllers/services eventually
 * reaches this middleware.
 */
export const errorMiddleware: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response<ApiErrorResponse>,
  _next: NextFunction,
): void => {
  /**
   * 1. Our own application errors.
   */
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorCode: error.errorCode,
    });

    return;
  }

  /**
   * 2. Zod validation errors.
   */
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errorCode: ERROR_CODES.VALIDATION_ERROR,
      errors: error.flatten().fieldErrors,
    });

    return;
  }

  /**
   * 3. JWT errors.
   *
   * These can happen if a JWT is malformed, expired, or
   * signed using the wrong secret.
   */
  if (error instanceof jwt.TokenExpiredError) {
    res.status(401).json({
      success: false,
      message: "Authentication token has expired",
      errorCode: ERROR_CODES.AUTH_TOKEN_EXPIRED,
    });

    return;
  }

  if (error instanceof jwt.JsonWebTokenError) {
    res.status(401).json({
      success: false,
      message: "Invalid authentication token",
      errorCode: ERROR_CODES.AUTH_INVALID_TOKEN,
    });

    return;
  }

  /**
   * 4. Unknown/unexpected errors.
   *
   * We don't expose the real error to the client because
   * it could contain sensitive implementation details.
   */
  console.error("Unhandled error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
  });
};