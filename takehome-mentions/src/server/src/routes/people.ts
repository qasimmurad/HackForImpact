import { Router } from "express";

/**
 * GET /api/people?q=<string>
 *
 * NOT IMPLEMENTED. This is one of the open tasks.
 *
 * People live in a hosted directory, not in the local database:
 *
 *   GET https://takehome.notion.dev/people?q=<query>&limit=<n>
 *     -> { results: Person[] }        // Person is exported from ../types.ts
 *
 * The directory is a black box you don't control: it does simple substring
 * matching over ~10,000 people, returns them unranked, caps each response at
 * 100 results, and has real-world latency (including an occasional slow
 * response). Build people search on top of it — here or anywhere you like; you
 * own this service. Decide things like: how to rank what it returns, whether
 * and what to cache, and how to stay responsive while it's being slow.
 *
 * A suggested response shape (you can change it — just keep the client in sync):
 *   { results: PersonSearchResult[] }   // PersonSearchResult is exported from ../types.ts
 */
export function createPeopleRouter(): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.status(501).json({
      error: "Not implemented",
      hint: "TODO(candidate): implement people search on top of the hosted people directory (see the comment in routes/people.ts).",
    });
  });

  return router;
}
