import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pool } from "./pool.js";

/**
 * __dirname is not directly available when using ES modules.
 *
 * These two lines recreate the current file's directory.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Directory containing our SQL migration files.
 */
const migrationsDirectory = path.join(__dirname, "migrations");

async function runMigrations(): Promise<void> {
  const client = await pool.connect();

  try {
    /**
     * Create a table that keeps track of migrations
     * that have already been executed.
     */
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    /**
     * Read all files from the migrations directory.
     */
    const files = await fs.readdir(migrationsDirectory);

    /**
     * Only use .sql files and sort them so that
     * 001 runs before 002, 003, etc.
     */
    const migrationFiles = files
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of migrationFiles) {
      /**
       * Check whether this migration has already run.
       */
      const result = await client.query(
        `
          SELECT id
          FROM schema_migrations
          WHERE filename = $1
        `,
        [file],
      );

      if (result.rowCount && result.rowCount > 0) {
        console.log(`Skipping migration: ${file}`);
        continue;
      }

      /**
       * Read the SQL file.
       */
      const filePath = path.join(migrationsDirectory, file);
      const sql = await fs.readFile(filePath, "utf-8");

      /**
       * Run the migration inside a transaction.
       *
       * If anything fails, the changes are rolled back.
       */
      await client.query("BEGIN");

      try {
        await client.query(sql);

        await client.query(
          `
            INSERT INTO schema_migrations (filename)
            VALUES ($1)
          `,
          [file],
        );

        await client.query("COMMIT");

        console.log(`Migration completed: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    console.log("All migrations completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();