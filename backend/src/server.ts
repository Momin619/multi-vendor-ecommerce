import { env } from "./config/env.js";

import { checkDatabaseConnection } from "./database/checkConnection.js";

import { startOtpCleanupJob } from "./jobs/otpCleanup.job.js";

import app from "./app.js";

/**
 * Start the server.
 */
const startServer = async (): Promise<void> => {
  try {
    /**
     * Verify database connection before starting
     * the HTTP server.
     */
    await checkDatabaseConnection();

    /**
     * Start background jobs.
     *
     * Deletes expired/old password-reset OTPs on an hourly
     * schedule so the table doesn't accumulate rows forever.
     */
    startOtpCleanupJob();

    app.listen(
      env.PORT,
      () => {
        console.log(
          `Server running on http://localhost:${env.PORT}`,
        );
      },
    );
  } catch (error) {
    console.error(
      "Failed to start server:",
      error,
    );

    process.exit(1);
  }
};

startServer();
