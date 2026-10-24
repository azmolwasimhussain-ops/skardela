import { describe, expect, it } from "vitest";
import { makeRandom } from "../../../shared/random";
import { randomPuzzleId } from "./randomPuzzle";

const others = ["guzzle-0002", "guzzle-0003", "guzzle-0004"];

// This helper selects many times, and gives each ID that it selected.
function selected(solved: readonly string[]) {
  const random = makeRandom(11);
  return new Set(Array.from({ length: 100 }, () => randomPuzzleId(others, solved, random)));
}

describe("randomPuzzleId", () => {
  it("selects only puzzles that the player did not solve", () => {
    expect(selected(["guzzle-0002"])).toEqual(new Set(["guzzle-0003", "guzzle-0004"]));
  });

  it("selects from all the other puzzles when the player solved all of them", () => {
    expect(selected(others)).toEqual(new Set(others));
  });

  it("ignores solved puzzles of other types and levels", () => {
    expect(selected(["latics-0001", "guzzle-0016"])).toEqual(new Set(others));
  });

  it("gives undefined when there is no other puzzle", () => {
    expect(randomPuzzleId([], ["guzzle-0001"])).toBeUndefined();
  });
});
