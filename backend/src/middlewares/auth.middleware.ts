import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  verifyAccessToken,
} from "../utils/jwt.js";

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
 * Extends Express Request so we can attach
 * authenticated user information.
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRole;
      };
    }
  }
}

/**
 * Authentication middleware.
 *
 * Authentication uses an HTTP-only cookie:
 *
 * accessToken=<JWT>
 *
 * The browser automatically sends this cookie
 * with the request.
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    /**
     * Get access token from the cookie.
     *
     * NOT from Authorization header.
     */
    const accessToken =
      req.cookies.accessToken;

    /**
     * No access token.
     */
    if (!accessToken) {
      throw new AppError(
        "Authentication required",
        401,
        ERROR_CODES.AUTH_UNAUTHORIZED,
      );
    }

    /**
     * Verify JWT.
     */
    const payload =
      verifyAccessToken(accessToken);

    /**
     * Make sure this is actually
     * an access token.
     */
    if (payload.type !== "access") {
      throw new AppError(
        "Invalid access token",
        401,
        ERROR_CODES.AUTH_INVALID_TOKEN,
      );
    }

    /**
     * Attach authenticated user
     * to the Express request.
     */
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware.
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
     * Authentication middleware should
     * normally run before this.
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
     * Check user's role.
     */
    if (
      !allowedRoles.includes(req.user.role)
    ) {
      next(
        new AppError(
          "You do not have permission to access this resource",
          403,
          ERROR_CODES.AUTH_FORBIDDEN,
        ),
      );

      return;
    }

    next();
  };
};