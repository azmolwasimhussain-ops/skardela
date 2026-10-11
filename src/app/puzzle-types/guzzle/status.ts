import { text } from "../../../text/en";
import { lineOf } from "./puzzle";
import type { LastMove, Mode } from "./useGame";

const words = text.guzzle;

// The status text tells the player what to do, what the last letter did, or the result.
export function statusText(
  mode: Mode | null,
  lastMove: LastMove,
  isSolved: boolean,
  mistakes: number,
  size: number,
): string {
  if (mode === null) return words.status.choose;
  if (isSolved) return words.status.solved(words.modes[mode], mistakes);
  if (lastMove === null) return words.status.start;
  const { letter, mark } = lastMove.guess;
  const line = lineOf(lastMove.index, size);
  const lineName = line === undefined ? "" : words.lines[line];
  switch (mark) {
    case "correct":
      return words.status.correct(letter);
    case "present":
      return words.status.present(letter, lineName);
    case "absent":
      return words.status.absent(letter, lineName);
  }
}
