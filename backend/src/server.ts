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

    const server = app.listen(
      env.PORT,
      () => {
        console.log(
          `Server running on http://localhost:${env.PORT}`,
        );
      },
    );

    /**
     * Without this handler, a port already in use (e.g. an orphaned
     * process left over from a previous run) crashes the process with
     * an unhandled "error" event — or worse, gets missed entirely,
     * leaving the OLD process as the one silently still answering
     * requests while this one appears to hang. Fail loudly instead.
     */
    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${env.PORT} is already in use. Stop whatever is using it (check with: netstat -ano | findstr :${env.PORT}) and try again.`,
        );
      } else {
        console.error("Server failed to start:", error);
      }

      process.exit(1);
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error,
    );

    process.exit(1);
  }
};

startServer();
