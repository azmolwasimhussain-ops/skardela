// This adds new Latics puzzles to "puzzles/latics.json". It is not a test: run it only when you want new puzzles.
//
//   LATICS_PLAN="water:easy:3,prism:hard:2" npm run generate:latics
//
// LATICS_PLAN: the puzzles to make, as material:level:count. The materials are water, critical, prism and filter.
// LATICS_SEED: the first seed (optional, 1 by default). The same plan and seed always give the same puzzles.
//   Use a different seed to get different puzzles.
// LATICS_TRIES: the number of boards to try for each plan item (optional, 50000 by default).
// The new puzzles get the next free IDs. Then run "npm run fix && npm run check", and play some of them.
import { readFileSync, writeFileSync } from "node:fs";
import { expect, it } from "vitest";
import type { LaticsPuzzle } from "../src/app/puzzle-types/latics/puzzle";
import { boardKey, generate, parsePlan, puzzleFileText } from "./latics-generator";

const file = new URL("../puzzles/latics.json", import.meta.url);

// The number in a Latics ID, for example 31 for "latics-0031".
const numberOf = (id: string) => Number(id.slice("latics-".length));
const idOf = (number: number) => `latics-${String(number).padStart(4, "0")}`;

// This makes the puzzles of the plan and adds them to the file. It gives a message with the new IDs, and the plan
// items without enough puzzles as text, for example "prism:hard:1". The text is empty when the plan is complete.
function addPuzzles(): { message: string; missing: string } {
  const plan = parsePlan(process.env.LATICS_PLAN ?? "");
  if (plan.length === 0) {
    throw new Error('Give a plan, for example: LATICS_PLAN="water:easy:3" npm run generate:latics');
  }
  const puzzles = JSON.parse(readFileSync(file, "utf8")) as LaticsPuzzle[];
  const { found, missing } = generate(plan, {
    seed: Number(process.env.LATICS_SEED ?? "1"),
    maxTries: Number(process.env.LATICS_TRIES ?? "50000"),
    known: puzzles.map((puzzle) => boardKey(puzzle)),
  });
  const next = Math.max(0, ...puzzles.map((puzzle) => numberOf(puzzle.id))) + 1;
  const added: LaticsPuzzle[] = [];
  for (const [position, puzzle] of found.entries())
    added.push({ ...puzzle, id: idOf(next + position) });
  writeFileSync(file, puzzleFileText([...puzzles, ...added]));
  const ids = added.map((puzzle) => puzzle.id).join(", ");
  return {
    message: `Added ${added.length} ${added.length === 1 ? "puzzle" : "puzzles"}: ${ids}.\n`,
    missing: missing.map((item) => `${item.material}:${item.level}:${item.count}`).join(","),
  };
}

it("adds new Latics puzzles to puzzles/latics.json", { timeout: 3_600_000 }, () => {
  const { message, missing } = addPuzzles();
  process.stdout.write(message);
  // The puzzles that the generator found are in the file. For a missing item, try LATICS_SEED or LATICS_TRIES.
  expect(missing).toBe("");
});
