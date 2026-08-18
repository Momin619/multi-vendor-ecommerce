import type { User } from "./user.types";

/**
 * Data submitted when registering a user.
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "customer" | "seller";
}

/**
 * Data submitted when logging in.
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Authentication response returned after login/register.
 */
export interface AuthData {
  user: User;
  accessToken: string;
}

/**
 * Data returned by the /me endpoint.
 */
export interface MeData {
  user: User;
}

/**
 * Data returned by the refresh endpoint.
 */
export interface RefreshData {
  accessToken: string;
}