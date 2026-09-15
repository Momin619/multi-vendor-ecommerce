import cron from "node-cron";

import { pool } from "../database/pool.js";

/**
 * Deletes OTP rows that are expired.
 *
 * Keeps the password_reset_otps table small and free of rows
 * that no longer serve any purpose — expired codes can never be
 * used again, so there's nothing meaningful to keep them for.
 */
export const cleanupExpiredOtps = async () => {
  try {
    await pool.query(`
      DELETE FROM password_reset_otps
      WHERE expires_at < NOW()
    `);

    console.log("[otp-cleanup] Expired OTPs cleaned up.");
  } catch (error) {
    console.error("[otp-cleanup] Failed to clean up expired OTPs:", error);
  }
};

/**
 * Schedules the OTP cleanup job to run every hour.
 *
 * Cron format is "minute hour day month weekday", so
 * "0 * * * *" means "at minute 0 of every hour".
 *
 * Called once from server.ts at startup.
 */
export const startOtpCleanupJob = (): void => {
  cron.schedule("0 * * * *", cleanupExpiredOtps);

  console.log("[otp-cleanup] Cron job scheduled (runs hourly).");

  /**
   * Also run once immediately on startup, so rows left over from
   * before a deploy/restart don't sit around for up to an hour
   * before the first scheduled run.
   */
  void cleanupExpiredOtps();
};
