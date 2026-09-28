import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const OUTPUT = "submission.zip";

/**
 * Package the working tree into submission.zip.
 *
 * Builds a throwaway git index from the current working tree rather than
 * archiving HEAD, so uncommitted edits and brand-new files are included — a
 * candidate who forgets to commit still submits their actual work. Because the
 * index is built with `git add -A`, .gitignore is honoured for free, which is
 * what keeps node_modules, dist, and the local database out of the zip.
 */
function main() {
  if (!isGitRepo()) {
    console.warn(
      `\n[package-submission] Skipped ${OUTPUT}: this is not a git repository.\n` +
        `[package-submission] Run \`git init && git add -A && git commit -m "start"\`, then re-run \`npm run build\`.\n`,
    );
    return;
  }

  const scratch = mkdtempSync(path.join(tmpdir(), "submission-"));
  const indexFile = path.join(scratch, "index");
  const env = { ...process.env, GIT_INDEX_FILE: indexFile };

  try {
    git(["add", "-A"], env);
    const tree = git(["write-tree"], env).trim();
    git(["archive", "--format=zip", `--prefix=submission/`, "--output", OUTPUT, tree]);
    console.log(`[package-submission] Wrote ${OUTPUT} from the current working tree.`);
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

function isGitRepo() {
  try {
    return git(["rev-parse", "--is-inside-work-tree"]).trim() === "true";
  } catch {
    return false;
  }
}

function git(args, env = process.env) {
  return execFileSync("git", args, { env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

main();
