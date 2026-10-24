import { renderHook } from "@testing-library/react";
import { StrictMode } from "react";
import { describe, expect, it, vi } from "vitest";
import { getLogger } from "./logger";
import { useLifecycleLog } from "./useLifecycleLog";

const log = getLogger("test.lifecycle");

type Props = { puzzleId: string; isSolved: boolean; mistakes: number };

// This helper renders the lifecycle log. It makes new detail objects for each render, as a board does.
function renderLifecycle(props: Props, options: { strict?: boolean } = {}) {
  return renderHook(
    ({ puzzleId, isSolved, mistakes }: Props) =>
      useLifecycleLog(log, {
        puzzleId,
        isSolved,
        started: { puzzleId },
        solved: { puzzleId, mistakes },
      }),
    { initialProps: props, ...(options.strict === true ? { wrapper: StrictMode } : {}) },
  );
}

describe("lifecycle log", () => {
  it("logs the start once, also when each render has new detail objects", () => {
    const info = vi.spyOn(log, "info");
    const { rerender } = renderLifecycle({ puzzleId: "a-0001", isSolved: false, mistakes: 0 });
    rerender({ puzzleId: "a-0001", isSolved: false, mistakes: 0 });
    rerender({ puzzleId: "a-0001", isSolved: false, mistakes: 1 });
    expect(info.mock.calls).toEqual([["Puzzle started", { puzzleId: "a-0001" }]]);
  });

  it("logs the start once in React strict mode, which runs each effect two times", () => {
    const info = vi.spyOn(log, "info");
    renderLifecycle({ puzzleId: "a-0001", isSolved: false, mistakes: 0 }, { strict: true });
    expect(info).toHaveBeenCalledTimes(1);
  });

  it("logs the solve once, with the latest details at the time of the solve", () => {
    const info = vi.spyOn(log, "info");
    const { rerender } = renderLifecycle({ puzzleId: "a-0001", isSolved: false, mistakes: 1 });
    rerender({ puzzleId: "a-0001", isSolved: true, mistakes: 2 });
    rerender({ puzzleId: "a-0001", isSolved: true, mistakes: 2 });
    expect(info.mock.calls).toEqual([
      ["Puzzle started", { puzzleId: "a-0001" }],
      ["Puzzle solved", { puzzleId: "a-0001", mistakes: 2 }],
    ]);
  });

  it("logs the start again for a different puzzle", () => {
    const info = vi.spyOn(log, "info");
    const { rerender } = renderLifecycle({ puzzleId: "a-0001", isSolved: false, mistakes: 0 });
    rerender({ puzzleId: "a-0002", isSolved: false, mistakes: 0 });
    expect(info.mock.calls).toEqual([
      ["Puzzle started", { puzzleId: "a-0001" }],
      ["Puzzle started", { puzzleId: "a-0002" }],
    ]);
  });
});
