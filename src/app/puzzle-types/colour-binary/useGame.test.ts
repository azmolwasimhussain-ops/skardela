import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import example from "./examples/colour-binary-0000.json";
import type { Move } from "./machine";
import { toSquares } from "./puzzle";
import { useGame } from "./useGame";

const start = toSquares(example.start);
const open = start.indexOf(".");

// In these tests, all calls in one "act" use the same render, as fast taps can do.
// Each event must still apply to the latest state.
describe("colour binary game hook with many events in one React batch", () => {
  it("applies each tap", () => {
    const { result } = renderHook(() => useGame(start));
    act(() => {
      result.current.tap(open);
      result.current.tap(open);
    });
    expect(result.current.squares[open]).toBe("B");
  });

  it("logs each move once and in order", () => {
    const onMove = vi.fn<(move: Move) => void>();
    const { result } = renderHook(() => useGame(start, onMove));
    act(() => {
      result.current.tap(open);
      result.current.askHint();
    });
    expect(onMove.mock.calls.map(([move]) => move.type)).toEqual(["tap", "hint"]);
  });
});
