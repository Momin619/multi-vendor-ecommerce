/**
 * The roles available in our application.
 *
 * These values must match the values used by the backend.
 */
export type UserRole = "customer" | "seller";

/**
 * Represents the authenticated user returned by the backend.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}