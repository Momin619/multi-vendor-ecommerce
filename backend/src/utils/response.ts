import type { Response } from "express";

/**
 * Standard successful API response.
 *
 * All successful API responses should follow this structure.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

/**
 * Sends a successful API response.
 *
 * Keeping this in one function means controllers don't have
 * to manually construct response objects everywhere.
 */
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 200,
): Response<ApiSuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};