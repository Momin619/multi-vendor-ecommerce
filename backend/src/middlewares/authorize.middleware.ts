import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  AppError,
} from "../utils/AppError.js";

import {
  ERROR_CODES,
} from "../utils/errorCodes.js";

import type {
  UserRole,
} from "../modules/auth/auth.types.js";

/**
 * Creates middleware that allows only specific roles.
 *
 * Example:
 *
 * authorize("seller")
 *
 * means only sellers can continue.
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      next(
        new AppError(
          "Authentication required",
          401,
          ERROR_CODES.AUTH_UNAUTHORIZED,
        ),
      );
      return;
    }

    
    if (!allowedRoles.includes(req.user.role)) {
      next(
        new AppError(
          "You are not authorized to access this resource",
          403,
          ERROR_CODES.AUTH_FORBIDDEN
        )
      );
      return;
    }

    next();
  };
};