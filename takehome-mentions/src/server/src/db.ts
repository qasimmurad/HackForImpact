import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Path to the local SQLite database, resolved at open time so NOTION_TH_DB_PATH
 * (used by the test suite to point at a throwaway database) can be set before
 * openDb() is called.
 */
export function resolveDbPath(): string {
  return process.env.NOTION_TH_DB_PATH ?? path.join(here, "..", "data", "app.db");
}

/** Open the database, creating the schema if it does not yet exist. */
export function openDb(): Database.Database {
  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  ensureSchema(db);
  return db;
}

/**
 * Create the tables candidates work against. Safe to call repeatedly.
 *
 * Pages only — people are not stored locally. They come from the hosted
 * directory that `/api/people` is meant to sit in front of (see routes/people.ts).
 */
export function ensureSchema(db: Database.Database): void {
  db.exec(`
		CREATE TABLE IF NOT EXISTS pages (
			id               TEXT PRIMARY KEY,
			title            TEXT NOT NULL,
			icon             TEXT NOT NULL,
			content          TEXT NOT NULL,
			created_time     TEXT NOT NULL,
			last_edited_time TEXT NOT NULL
		);
	`);
}
