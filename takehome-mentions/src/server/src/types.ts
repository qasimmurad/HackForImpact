/** A page that can be @-mentioned. Stored in the `pages` table. */
export type Page = {
  id: string;
  title: string;
  icon: string;
  /** A short body excerpt. More text to match and rank against than the title alone. */
  content: string;
  /** ISO 8601 timestamp. */
  createdTime: string;
  /** ISO 8601 timestamp. Always >= createdTime. */
  lastEditedTime: string;
};

/** A person that can be @-mentioned. Served by the hosted people directory (see routes/people.ts). */
export type Person = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  title: string;
  team: string;
};

/** Shape returned by GET /api/pages: a `Page` row tagged with `type` for the client's mention union. */
export type PageSearchResult = Page & { type: "page" };

/** Shape GET /api/people should return once implemented: a `Person` row tagged with `type`. */
export type PersonSearchResult = Person & { type: "person" };
