import { z } from "zod";

/**
 * Registration validation.
 */
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email cannot exceed 255 characters"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),

  role: z.enum(["customer", "seller"]),
});

/**
 * Login validation.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

/**
 * Forgot-password validation.
 *
 * Only an email is required to request an OTP.
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),
});

/**
 * Reset-password validation.
 *
 * Requires the email, the 6-digit OTP that was emailed to it,
 * and the new password.
 */
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  otp: z
    .string()
    .trim()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),

  newPassword: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

/**
 * Refresh-token validation.
 */

export type RegisterInput =
  z.infer<typeof registerSchema>;

export type LoginInput =
  z.infer<typeof loginSchema>;

export type ForgotPasswordInput =
  z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordInput =
  z.infer<typeof resetPasswordSchema>;
