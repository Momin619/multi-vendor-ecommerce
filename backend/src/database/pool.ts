import { Pool } from "pg";
import { env } from "../config/env.js";

/**
 * PostgreSQL connection pool.
 *
 * A pool maintains multiple database connections and reuses them
 * instead of creating a brand-new connection for every query.
 */
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

/**
 * Listen for unexpected errors on idle PostgreSQL clients.
 */
pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});