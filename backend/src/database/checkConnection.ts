import { pool } from "./pool.js";

/**
 * Checks whether the application can successfully connect
 * to PostgreSQL.
 *
 * This is called when the server starts.
 */
export const checkDatabaseConnection = async (): Promise<void> => {
  try {
    /**
     * SELECT 1 doesn't modify any data.
     *
     * It simply verifies that PostgreSQL is reachable.
     */
    await pool.query("SELECT 1");

    console.log("PostgreSQL connected successfully.");
  } catch (error) {
    console.error(
      "Failed to connect to PostgreSQL:",
      error,
    );

    throw error;
  }
};