import { describe, expect, it } from "vitest";
import { makeRandom, pickOne } from "./random";

describe("pickOne", () => {
  it("gives undefined for an empty list", () => {
    expect(pickOne([], makeRandom(1))).toBeUndefined();
  });

  it("gives each item of the list, and only items of the list", () => {
    const items = ["a", "b", "c"];
    const random = makeRandom(7);
    const picked = new Set(Array.from({ length: 100 }, () => pickOne(items, random)));
    expect(picked).toEqual(new Set(items));
  });

  it("gives the first item for 0 and the last item for a value just under 1", () => {
    expect(pickOne(["a", "b", "c"], () => 0)).toBe("a");
    expect(pickOne(["a", "b", "c"], () => 0.999_999)).toBe("c");
  });
});
