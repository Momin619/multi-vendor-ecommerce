import crypto from "node:crypto";

/**
 * 6-digit numeric OTP range.
 *
 * crypto.randomInt(min, max) returns an integer in [min, max),
 * so 1000000 is exclusive and every result is exactly 6 digits.
 */
const OTP_MIN = 100000;
const OTP_MAX = 1000000;

/**
 * Generates a cryptographically secure 6-digit OTP.
 *
 * Uses crypto.randomInt instead of Math.random, which is not
 * safe for anything security-related.
 */
export const generateOtp = (): string => {
  return crypto.randomInt(OTP_MIN, OTP_MAX).toString();
};

/**
 * Hashes an OTP before storing it in the database.
 *
 * OTPs are short-lived, single-use, and already rate-limited by
 * attempts + expiry, so a fast hash (SHA-256) is sufficient here.
 * A slow, salted algorithm like bcrypt (used for passwords) isn't
 * necessary and would only add latency.
 */
export const hashOtp = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

/**
 * Timing-safe comparison between a submitted OTP and its stored hash.
 *
 * Using a plain string/hash comparison (===) can leak timing
 * information that an attacker could use to guess the code
 * character by character. crypto.timingSafeEqual avoids that.
 */
export const compareOtp = (otp: string, otpHash: string): boolean => {
  const incomingHash = hashOtp(otp);

  const a = Buffer.from(incomingHash, "hex");
  const b = Buffer.from(otpHash, "hex");

  /**
   * timingSafeEqual throws if buffer lengths differ, so we
   * guard against that first. Both are SHA-256 hex digests
   * (32 bytes), so this only fails if otpHash is malformed.
   */
  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
};
