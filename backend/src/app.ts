import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes.js";

import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import dashboardRouter from "./modules/dashboard/dashboard.routes.js";
import productRouter from "./modules/products/products.routes.js";
import catalogRouter from "./modules/catalog/catalog.routes.js";

import { logger } from "./middlewares/logger.middleware.js";

const app = express();

app.use(logger);

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
  dashboardRouter,
);
app.use(
  "/api/products",
  productRouter,
);
app.use(
  "/api/catalog",
  catalogRouter,
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

export default app;
