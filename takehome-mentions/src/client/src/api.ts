import type { PageResult, PersonResult } from "./types";

const API_BASE = "/api";

/** Search pages. Backed by the provided GET /api/pages endpoint. */
export async function searchPages(query: string): Promise<PageResult[]> {
  const res = await fetch(`${API_BASE}/pages?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`pages search failed: ${res.status}`);
  const data = (await res.json()) as { results?: PageResult[] };
  return Array.isArray(data.results) ? data.results : [];
}

/**
 * Search people. We host a "service" that renders people data. As a reminder,
 * it's available at `GET takehome.notion.dev/people?q=<query>&limit=<n>`.
 *
 * Your endpoint should proxy to that service, and your client should call your endpoint.
 */
export async function searchPeople(query: string): Promise<PersonResult[]> {
  const res = await fetch(`${API_BASE}/people?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`people search failed: ${res.status}`);
  const data = (await res.json()) as { results?: PersonResult[] };
  return Array.isArray(data.results) ? data.results : [];
}

// TODO: something else you choose to build, here!
