import { useEffect, useState } from "react";
import { searchPages } from "./api";
import { MentionMenu } from "./MentionMenu";
import type { MentionResult } from "./types";
import "./App.css";

// Matches an in-progress @-mention at the end of the text, e.g. "...hello @road".
// This is the simplest possible trigger detection — it assumes the caret is at
// the end of the input. Making it robust (caret position, closing the menu,
// multiple mentions) is part of the exercise.
const MENTION_RE = /@([^@\s]*)$/;

export function App() {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<MentionResult[]>([]);

  const match = value.match(MENTION_RE);
  const query = match ? match[1] : null;
  const isMenuOpen = query !== null;

  useEffect(() => {
    if (query === null) {
      setResults([]);
      return;
    }
    // Naive: one request per keystroke, no debounce. `ignore` gives last-write-
    // wins so a slow earlier response can't clobber a newer one. Improving the
    // fetching strategy (debounce, cancellation, caching, merging people/dates)
    // is up to you.
    let ignore = false;
    async function run(q: string) {
      try {
        const pages = await searchPages(q);
        if (!ignore) setResults(pages);
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setResults([]);
        }
      }
    }
    run(query);
    return () => {
      ignore = true;
    };
  }, [query]);

  function handleSelect(result: MentionResult) {
    const label =
      result.type === "page" ? result.title : result.type === "person" ? result.name : result.label;
    // Baseline just inserts plain text. Rendering a styled, non-editable token
    // (a "pill") is part of the exercise.
    setValue(value.replace(MENTION_RE, () => `@${label} `));
  }

  return (
    <main className="app">
      <div className="composer">
        <textarea
          className="composer__input"
          placeholder="Type @ to mention a page, person, or date…"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={3}
          autoFocus
        />
        {isMenuOpen && <MentionMenu results={results} onSelect={handleSelect} />}
      </div>
    </main>
  );
}
