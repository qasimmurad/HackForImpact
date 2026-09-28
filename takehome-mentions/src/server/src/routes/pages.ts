import { Router } from "express";
import type Database from "better-sqlite3";
import { chaos } from "../chaos.js";
import type { Page, PageSearchResult } from "../types.js";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

/**
 * GET /api/pages?q=<string>&limit=<n>
 *
 * Case-insensitive substring search over page titles. Results are ordered
 * deterministically (earliest match position first, then title, then id) so
 * that the same query always returns the same order — useful when you care
 * about result stability as the user types.
 *
 * Each page also carries `content`, `createdTime`, and `lastEditedTime`. The
 * search deliberately ignores all three: matching body text, or ranking recent
 * pages above stale ones, is yours to add if you think it matters.
 *
 * This endpoint works out of the box. You are free to read it, change it, or
 * leave it alone.
 */
export function createPagesRouter(db: Database.Database): Router {
  const router = Router();

  const search = db.prepare<[string, string, number]>(`
		SELECT
			id,
			title,
			icon,
			content,
			created_time     AS createdTime,
			last_edited_time AS lastEditedTime
		FROM pages
		WHERE lower(title) LIKE '%' || lower(?) || '%' ESCAPE '\\'
		ORDER BY instr(lower(title), lower(?)), title, id
		LIMIT ?
	`);

  router.get("/", chaos("pages"), (req, res) => {
    const q = firstString(req.query.q) ?? "";
    const limit = clampLimit(firstString(req.query.limit));

    const rows = search.all(escapeLike(q), q, limit) as Page[];
    const results: PageSearchResult[] = rows.map((row) => ({
      type: "page",
      id: row.id,
      title: row.title,
      icon: row.icon,
      content: row.content,
      createdTime: row.createdTime,
      lastEditedTime: row.lastEditedTime,
    }));

    res.json({ results });
  });

  return router;
}

/** Read a query-string field as a single string, taking the first if repeated. */
function firstString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return undefined;
}

/** Escape LIKE metacharacters so the query matches literally (paired with ESCAPE '\'). */
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

function clampLimit(raw: string | undefined): number {
  const parsed = raw !== undefined ? Number.parseInt(raw, 10) : NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_LIMIT;
  return Math.min(parsed, MAX_LIMIT);
}
