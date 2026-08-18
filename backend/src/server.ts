import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";

import { checkDatabaseConnection } from "./database/checkConnection.js";

import authRoutes from "./modules/auth/auth.routes.js";

import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import dashboardRoutes from "./dashboard/dashboard.routes.js";
const app = express();

/**
 * Parse incoming JSON request bodies.
 */
app.use(express.json());

/**
 * Parse cookies from incoming requests.
 */
app.use(cookieParser());

/**
 * Allow the React frontend to communicate with the backend.
 *
 * Update the origin when your frontend runs on a different port.
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

/**
 * Authentication routes.
 */
app.use(
  "/api/auth",
  authRoutes,
);

app.use(
  "/api",
  dashboardRoutes,
);

/**
 * Handle unknown routes.
 *
 * This must come AFTER all application routes.
 */
app.use(notFoundMiddleware);

/**
 * Global error handler.
 *
 * This must be the LAST middleware.
 */
app.use(errorMiddleware);

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