import express, { type Express } from "express";
import cors from "cors";
import type Database from "better-sqlite3";
import { openDb } from "./db.js";
import { createPagesRouter } from "./routes/pages.js";
import { createPeopleRouter } from "./routes/people.js";

/** Build the Express app. Pass a db handle in tests; defaults to the local one. */
export function createApp(db: Database.Database = openDb()): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/pages", createPagesRouter(db));
  app.use("/api/people", createPeopleRouter());

  return app;
}
