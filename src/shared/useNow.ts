import { useEffect, useState } from "react";

// The time now, in milliseconds. It changes each "intervalMs" while "isRunning" is true.
// A render must not read the clock, thus a component that shows a time uses this hook.
export function useNow(intervalMs: number, isRunning = true): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setNow(Date.now());
    }, intervalMs);
    return () => {
      clearInterval(id);
    };
  }, [intervalMs, isRunning]);
  return now;
}
