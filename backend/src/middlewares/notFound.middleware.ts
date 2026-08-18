import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../utils/AppError.js";
import { ERROR_CODES } from "../utils/errorCodes.js";

/**
 * Handles requests for routes that don't exist.
 */
export const notFoundMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(
    new AppError(
      `Route ${req.method} ${req.originalUrl} not found`,
      404,
      ERROR_CODES.NOT_FOUND,
    ),
  );
};