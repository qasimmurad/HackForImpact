import path from "node:path";
import { fileURLToPath } from "node:url";
import type Database from "better-sqlite3";
import { openDb } from "./db.js";

const PAGE_COUNT = 300;
const DAY_MS = 86_400_000;
const MAX_AGE_DAYS = 540;

/**
 * Deterministic seed: the same code always produces the same titles, content,
 * and row order, so grading and tests are reproducible. Generation uses a tiny
 * seeded PRNG.
 *
 * Timestamps are the one exception. They are offsets back from `now` rather
 * than fixed dates, so a freshly seeded database always holds realistically
 * recent pages instead of ones that quietly age into "edited three years ago".
 * The offsets come from the same PRNG, so relative recency is stable too. Pass
 * `now` to pin them.
 *
 * Pages only — people come from the hosted directory, not from here.
 */
export function seedDatabase(db: Database.Database, now: number = Date.now()): { pages: number } {
  const rand = makeRng(42);

  const seed = db.transaction(() => {
    db.exec("DELETE FROM pages;");

    const insertPage = db.prepare(
      `INSERT INTO pages (id, title, icon, content, created_time, last_edited_time)
			 VALUES (?, ?, ?, ?, ?, ?)`,
    );
    for (let i = 0; i < PAGE_COUNT; i++) {
      const { createdTime, lastEditedTime } = makeTimestamps(rand, now);
      insertPage.run(
        `page_${i}`,
        makePageTitle(rand),
        pick(rand, PAGE_ICONS),
        makeContent(rand),
        createdTime,
        lastEditedTime,
      );
    }
  });
  seed();

  const pages = (db.prepare("SELECT count(*) AS n FROM pages").get() as { n: number }).n;
  return { pages };
}

function makePageTitle(rand: () => number): string {
  const pattern = Math.floor(rand() * 3);
  if (pattern === 0) return `${pick(rand, ADJECTIVES)} ${pick(rand, NOUNS)}`;
  if (pattern === 1) return `${pick(rand, NOUNS)} ${pick(rand, DOC_TYPES)}`;
  return `${pick(rand, TEAMS)} ${pick(rand, DOC_TYPES)}`;
}

/**
 * A short body excerpt. The vocabulary is deliberately different from the title
 * pools, so searching content surfaces pages that a title-only search misses.
 */
function makeContent(rand: () => number): string {
  return `${pick(rand, CONTENT_OPENERS)} ${pick(rand, CONTENT_TOPICS)}. ${pick(rand, CONTENT_DETAILS)}`;
}

/** A created/edited pair, both in the past, with edited never before created. */
function makeTimestamps(
  rand: () => number,
  now: number,
): { createdTime: string; lastEditedTime: string } {
  const ageMs = Math.floor(rand() * MAX_AGE_DAYS * DAY_MS);
  const createdMs = now - ageMs;
  const editedMs = createdMs + Math.floor(rand() * ageMs);
  return {
    createdTime: new Date(createdMs).toISOString(),
    lastEditedTime: new Date(editedMs).toISOString(),
  };
}

/** Deterministic floats in [0, 1). */
function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function pick<T>(rand: () => number, items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)];
}

const ADJECTIVES = [
  "Quarterly",
  "Annual",
  "Weekly",
  "Draft",
  "Final",
  "Internal",
  "Public",
  "Shared",
  "Personal",
  "Team",
] as const;
const NOUNS = [
  "Roadmap",
  "Planning",
  "Retro",
  "Notes",
  "Budget",
  "Launch",
  "Onboarding",
  "Strategy",
  "Research",
  "Standup",
  "Spec",
  "Review",
] as const;
const DOC_TYPES = [
  "Doc",
  "Wiki",
  "Tracker",
  "Database",
  "Board",
  "Plan",
  "Checklist",
  "Brief",
] as const;
const TEAMS = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Support",
  "Product",
  "Data",
  "People",
] as const;
const PAGE_ICONS = [
  "📄",
  "📝",
  "📊",
  "📈",
  "🗂️",
  "📁",
  "✅",
  "🚀",
  "🔧",
  "💡",
  "📌",
  "🗓️",
] as const;

const CONTENT_OPENERS = [
  "Notes from",
  "Draft plan for",
  "Summary of",
  "Action items from",
  "Background on",
  "Open questions about",
  "Meeting notes for",
  "Proposal covering",
] as const;
const CONTENT_TOPICS = [
  "the mobile redesign",
  "search relevance",
  "API rate limits",
  "the billing migration",
  "customer feedback triage",
  "the hiring loop",
  "incident follow-ups",
  "vendor evaluation",
  "the pricing model",
  "accessibility fixes",
  "the Q3 rollout",
  "data retention",
] as const;
const CONTENT_DETAILS = [
  "Owner is still unassigned.",
  "Blocked on legal review.",
  "Shipped behind a feature flag.",
  "Needs a decision by end of week.",
  "Superseded by a newer doc.",
  "Waiting on design sign-off.",
  "Rolled out to 10% of traffic.",
  "Archived after the reorg.",
] as const;

// --- CLI entrypoint ---

function isMain(): boolean {
  const entry = process.argv[1];
  return !!entry && path.resolve(entry) === fileURLToPath(import.meta.url);
}

if (isMain()) {
  const db = openDb();
  const counts = seedDatabase(db);
  db.close();
  // eslint-disable-next-line no-console
  console.log(`Seeded ${counts.pages} pages into the local database.`);
}
