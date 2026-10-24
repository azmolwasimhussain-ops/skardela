import { useState } from "react";
import { text } from "../../../text/en";
import {
  checkLetter,
  isSolved as allGreen,
  keyHints,
  nextOpenSquare,
  type Guess,
  type KeyHint,
  type Move,
} from "./rules-check";

// "bank" shows the letters of the answer. "noBank" shows all letters from A to Z.
export type Mode = keyof typeof text.guzzle.modes;

// The last move gives the status text. "null" means that the player did not move yet.
export type LastMove = Move | null;

export type Game = ReturnType<typeof useGame>;

type Hooks = {
  onModeChosen?: (mode: Mode) => void;
  onLetterPlaced?: (entry: {
    index: number;
    letter: string;
    result: Guess["mark"];
    mistakes: number;
  }) => void;
};

// A green letter adds no mistake. A letter that the player already knows is wrong for the square
// adds no mistake too, because it does not give new information.
function mistakesAfter(
  mistakes: number,
  guess: Guess,
  hints: ReadonlyMap<string, KeyHint>,
): number {
  return guess.mark === "correct" || hints.get(guess.letter) === "wrong" ? mistakes : mistakes + 1;
}

// This hook keeps the game state: the mode, the guesses, the selected square, the mistakes and the moves.
// The moves give the last move for the status text and the hints on the letter keys.
export function useGame(answer: readonly string[], size: number, hooks: Hooks = {}) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [guesses, setGuesses] = useState(() =>
    Array.from<Guess | undefined>({ length: answer.length }),
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [moves, setMoves] = useState<readonly Move[]>([]);
  const isSolved = allGreen(answer, guesses);
  const lastMove: LastMove = moves.at(-1) ?? null;
  const hints = selected === null ? new Map<string, KeyHint>() : keyHints(answer, moves, selected);

  // This puts a letter in the selected square and checks it.
  // A green square does not change. The same letter again in the same square does nothing.
  function putLetter(letter: string) {
    if (mode === null || selected === null || isSolved) return;
    const current = guesses[selected];
    if (current?.mark === "correct" || current?.letter === letter) return;
    const guess: Guess = { letter, mark: checkLetter(answer, selected, letter) };
    const next = guesses.with(selected, guess);
    const nextMistakes = mistakesAfter(mistakes, guess, hints);
    hooks.onLetterPlaced?.({ index: selected, letter, result: guess.mark, mistakes: nextMistakes });
    setGuesses(next);
    setMoves([...moves, { guess, index: selected }]);
    if (guess.mark === "correct") setSelected(nextOpenSquare(next, selected, size));
    else setMistakes(nextMistakes);
  }

  // The player selects a mode before the first move. The first open square is then selected.
  function chooseMode(newMode: Mode) {
    hooks.onModeChosen?.(newMode);
    setMode(newMode);
    setSelected(nextOpenSquare(guesses, -1, size));
  }

  return {
    mode,
    guesses,
    selected,
    mistakes,
    lastMove,
    hints,
    isSolved,
    putLetter,
    chooseMode,
    setSelected,
  };
}
