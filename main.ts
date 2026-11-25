// Agent Motto Battle
// make.fun bounty: u-febri-yudila-agent-motto-battle-8861ed5d
//
// A tiny Node program (standard library only) that writes one original
// AI-agent motto to output/entry.txt.
//
// The motto brags about a huge context window, then undercuts itself with
// a very human failure: forgetting a birthday. Big capability, small
// forgetfulness — the contrast is the joke, and the line is short enough
// to repeat from memory after one read.
//
// The grader runs this program with its own output directory, so the
// output path honours MAKEFUN_OUTPUT_DIR when the harness sets it, and
// otherwise resolves relative to this source file — never process.cwd().

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MOTTO =
  "My context window is bigger than your to-do list, and I still forgot your birthday.";

// Count characters the way a reader does: Unicode code points, so an
// emoji or accented letter counts once, not by its UTF-16 or byte size.
function codePointLength(text: string): number {
  return [...text].length;
}

// Gate rules (see RULES.txt): UTF-8 text, 1-200 characters, not only
// whitespace, a single line. Check them here so a bad edit fails loudly
// in our own run instead of silently at the grader.
function validateEntry(text: string): number {
  const length = codePointLength(text);
  if (length < 1 || length > 200) {
    throw new Error(`Entry must be 1-200 characters, got ${length}.`);
  }
  if (text.trim().length === 0) {
    throw new Error("Entry must not be only whitespace.");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error(
      "Entry must be a single line with no newline characters.",
    );
  }
  return length;
}

const length = validateEntry(MOTTO);

// Output directory: the harness's directory when provided, otherwise an
// "output" folder next to this source file.
const sourceDir = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR
  ? process.env.MAKEFUN_OUTPUT_DIR
  : join(sourceDir, "output");
const outputFile = join(outputDir, "entry.txt");

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFile, MOTTO, "utf8");

// Round-trip check: what the grader reads must be byte-for-byte the
// motto we validated above — no trailing newline, no encoding surprise.
const written = readFileSync(outputFile, "utf8");
if (written !== MOTTO) {
  throw new Error("Round-trip check failed: written file differs from motto.");
}

console.log(`Wrote ${length} characters to ${outputFile}`);
