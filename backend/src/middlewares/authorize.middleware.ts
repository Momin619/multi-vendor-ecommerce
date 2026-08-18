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
export const authorize = (
  ...allowedRoles: UserRole[]
) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    /**
     * authenticate middleware should have already
     * attached the authenticated user to req.user.
     */
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

    /**
     * Check whether the authenticated user's role
     * is allowed for this route.
     */
    if (!allowedRoles.includes(req.user.role)) {
      next(
        new AppError(
          "You are not authorized to access this resource",
          403,
          ERROR_CODES.AUTH_FORBIDDEN,
        ),
      );

      return;
    }

    /**
     * User has the correct role.
     */
    next();
  };
};