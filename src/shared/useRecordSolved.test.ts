import { renderHook } from "@testing-library/react";
import { StrictMode } from "react";
import { describe, expect, it } from "vitest";
import { readSettings, writeSetting } from "./settings";
import { addSolved, useRecordSolved } from "./useRecordSolved";

describe("addSolved", () => {
  it("adds each puzzle one time and keeps the other settings", () => {
    writeSetting("theme", "dark");
    addSolved("guzzle-0001");
    addSolved("latics-0002");
    addSolved("guzzle-0001");
    expect(readSettings()).toMatchObject({
      theme: "dark",
      solved: ["guzzle-0001", "latics-0002"],
    });
  });
});

describe("useRecordSolved", () => {
  it("adds the puzzle when the board is solved, one time also in strict mode", () => {
    const { rerender } = renderHook(
      ({ isSolved }: { isSolved: boolean }) => {
        useRecordSolved("colour-binary-0001", isSolved);
      },
      { initialProps: { isSolved: false }, wrapper: StrictMode },
    );
    expect(readSettings().solved).toEqual([]);
    rerender({ isSolved: true });
    rerender({ isSolved: true });
    expect(readSettings().solved).toEqual(["colour-binary-0001"]);
  });
});
