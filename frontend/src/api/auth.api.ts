import api from "./axios";

import type {
  LoginData,
  RegisterData,
} from "../types/auth.types";

import type {
  User,
} from "../types/user.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthData {
  user: User;
}

/**
 * Login
 *
 * Backend sets:
 * - accessToken cookie
 * - refreshToken cookie
 */
export const login = async (
  data: LoginData,
): Promise<ApiResponse<AuthData>> => {
  const response =
    await api.post<ApiResponse<AuthData>>(
      "/auth/login",
      data,
    );

  return response.data;
};

/**
 * Register
 *
 * Backend sets:
 * - accessToken cookie
 * - refreshToken cookie
 */
export const register = async (
  data: RegisterData,
): Promise<ApiResponse<AuthData>> => {
  const response =
    await api.post<ApiResponse<AuthData>>(
      "/auth/register",
      data,
    );

  return response.data;
};

/**
 * Refresh authentication.
 *
 * Browser sends refreshToken cookie.
 *
 * Backend sets new:
 * - accessToken cookie
 * - refreshToken cookie
 */
export const refreshToken = async (): Promise<
  ApiResponse<null>
> => {
  const response =
    await api.post<ApiResponse<null>>(
      "/auth/refresh",
    );

  return response.data;
};

/**
 * Get current authenticated user.
 *
 * Browser sends accessToken cookie.
 */
export const getMe = async (): Promise<
  ApiResponse<{ user: User }>
> => {
  const response =
    await api.get<
      ApiResponse<{ user: User }>
    >(
      "/auth/me",
    );

  return response.data;
};

/**
 * Logout.
 *
 * Backend clears authentication cookies.
 */
export const logout = async (): Promise<
  ApiResponse<null>
> => {
  const response =
    await api.post<ApiResponse<null>>(
      "/auth/logout",
    );

  return response.data;
};