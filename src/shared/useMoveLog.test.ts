import { act, renderHook } from "@testing-library/react";
import { StrictMode, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { useMoveLog } from "./useMoveLog";

// A small hook with a list of moves, as a state machine keeps it. "add" puts a move at the end of the list.
// The update reads the latest list, so many calls in one React batch add many moves.
function useMoves(onMove?: (move: string) => void) {
  const [moves, setMoves] = useState<readonly string[]>([]);
  useMoveLog(moves, onMove);
  return {
    add: (move: string) => {
      setMoves((current) => [...current, move]);
    },
  };
}

describe("move log", () => {
  it("logs each move once and in order, also for many moves in one React batch", () => {
    const onMove = vi.fn<(move: string) => void>();
    const { result } = renderHook(() => useMoves(onMove));
    act(() => {
      result.current.add("a");
      result.current.add("b");
    });
    act(() => {
      result.current.add("c");
    });
    expect(onMove.mock.calls).toEqual([["a"], ["b"], ["c"]]);
  });

  it("logs a move with the latest log function, without a log for an earlier move again", () => {
    const first = vi.fn<(move: string) => void>();
    const latest = vi.fn<(move: string) => void>();
    const { result, rerender } = renderHook(({ onMove }) => useMoves(onMove), {
      initialProps: { onMove: first },
    });
    act(() => {
      result.current.add("a");
    });
    rerender({ onMove: latest });
    act(() => {
      result.current.add("b");
    });
    expect(first.mock.calls).toEqual([["a"]]);
    expect(latest.mock.calls).toEqual([["b"]]);
  });

  it("logs each move once in React strict mode, which runs each effect two times", () => {
    const onMove = vi.fn<(move: string) => void>();
    const { result } = renderHook(() => useMoves(onMove), { wrapper: StrictMode });
    act(() => {
      result.current.add("a");
    });
    expect(onMove.mock.calls).toEqual([["a"]]);
  });
});
