import axios from "axios";

import type {
  ApiErrorResponse,
} from "../types/api.types";

/**
 * Converts an unknown error into a user-friendly message.
 */
export const getErrorMessage = (
  error: unknown,
): string => {
  /**
   * Check whether the error came from Axios.
   */
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      "Something went wrong. Please try again."
    );
  }

  /**
   * Handle normal JavaScript errors.
   */
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

/**
 * Extract field-level validation errors from backend.
 *
 * Example backend response:
 *
 * errors: {
 *   email: ["Invalid email"],
 *   password: ["Password is required"]
 * }
 */
export const getFieldErrors = (
  error: unknown,
): Record<string, string[]> => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.errors ?? {};
  }

  return {};
};