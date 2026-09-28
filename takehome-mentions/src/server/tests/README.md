# Tests

Run everything with:

```bash
npm test
```

`pages.test.ts` is a baseline check that the provided pages endpoint works. It
seeds a temporary database, so it won't disturb your local `npm run seed` data.

## Adding tests for what you build

We run a small suite against each submission to sanity-check the tasks you say
you completed. You don't have to hit 100% coverage — a few focused tests that
show the behavior you implemented works are worth far more than many shallow
ones.

Good things to cover if you build them:

- People search: querying `/api/people` returns ranked, relevant results.
- Dynamic dates: "tomorrow" resolves to the correct absolute date — and
  still does if the clock moves (don't store the literal word).
- Ranking / merging: results across sources come back in the order you
  intend.
- Recency and content: pages carry `content`, `createdTime`, and
  `lastEditedTime`. If you match on body text or rank recent pages higher,
  assert the resulting order rather than just that the fields came back.

Server-side tests can use `supertest` against `createApp()` (see
`pages.test.ts`). Client-side logic is easiest to test as plain functions —
factor ranking/date-parsing out of components so they're callable directly.
