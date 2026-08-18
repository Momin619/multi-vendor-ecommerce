/**
 * Roles supported by the application.
 */
export type UserRole = "customer" | "seller";

/**
 * Public user object.
 *
 * password_hash is intentionally excluded.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * Access JWT payload.
 */
export interface AccessTokenPayload {
  userId: string;
  role: UserRole;
  type: "access";
}

/**
 * Refresh JWT payload.
 */
export interface RefreshTokenPayload {
  userId: string;
  type: "refresh";
}

/**
 * Authentication result returned by the service.
 */
export interface AuthResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

/**
 * Data attached to Express request after authentication.
 */
export interface AuthenticatedRequestUser {
  userId: string;
  role: UserRole;
}