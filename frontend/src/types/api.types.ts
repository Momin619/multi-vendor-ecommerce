/**
 * Generic successful API response.
 *
 * T represents the type of data returned by the API.
 */
export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

/**
 * Standard API error response returned by our backend.
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode: string;

  /**
   * Used mainly for schema validation errors.
   *
   * Example:
   *
   * {
   *   email: ["Invalid email"],
   *   password: ["Password is required"]
   * }
   */
  errors?: Record<string, string[]>;
}