import type { MentionResult } from "./types";

type MentionMenuProps = {
  results: MentionResult[];
  onSelect: (result: MentionResult) => void;
};

/**
 * Plain, intentionally-minimal results list. There is no keyboard navigation,
 * no highlighting of the matched substring, and no token styling here yet — that
 * is for you to build. It just renders what the menu found.
 */
export function MentionMenu({ results, onSelect }: MentionMenuProps) {
  if (results.length === 0) {
    return <div className="menu menu--empty">No results</div>;
  }

  return (
    <ul className="menu">
      {results.map((result) => (
        <li key={result.id} className="menu__item">
          <button type="button" className="menu__button" onClick={() => onSelect(result)}>
            <MentionLabel result={result} />
          </button>
        </li>
      ))}
    </ul>
  );
}

function MentionLabel({ result }: { result: MentionResult }) {
  switch (result.type) {
    case "page":
      return (
        <span>
          <span className="menu__icon">{result.icon}</span> {result.title}
        </span>
      );
    case "person":
      return <span>{result.name}</span>;
    case "date":
      return <span>{result.label}</span>;
  }
}
