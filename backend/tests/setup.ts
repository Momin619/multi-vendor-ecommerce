import { beforeEach, afterAll } from "vitest";

/**
 * Must run before anything imports `config/env.ts`, so it picks up
 * `.env.test` instead of `.env`. `setupFiles` runs before test files,
 * but modules already imported by an earlier test file stay cached —
 * see vitest.config.ts's `fileParallelism: false`, which keeps every
 * test file's DB access sequential against the same test database.
 */
process.env.NODE_ENV = "test";

const { pool } = await import("../src/database/pool.js");

beforeEach(async () => {
  await pool.query(
    `TRUNCATE TABLE password_reset_otps, users RESTART IDENTITY CASCADE`,
  );
});

afterAll(async () => {
  await pool.end();
});
