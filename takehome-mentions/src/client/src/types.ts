import type { PageSearchResult, PersonSearchResult } from "@server/types";

/**
 * The kinds of things the @ menu can surface. Pages and people come from the
 * server, so their shapes are imported from @server to keep client and server
 * in sync. Dates are client-only and up to you to implement.
 */
export type PageResult = PageSearchResult;

export type PersonResult = PersonSearchResult;

export type DateResult = {
  type: "date";
  id: string;
  label: string;
  /** Resolved absolute date as ISO (YYYY-MM-DD). */
  iso: string;
};

export type MentionResult = PageResult | PersonResult | DateResult;
