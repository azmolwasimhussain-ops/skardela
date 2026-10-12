import { useState } from "react";
import { text } from "../../../text/en";
import { checkLetter, isSolved as allGreen, nextOpenSquare, type Guess } from "./rules-check";

// "bank" shows the letters of the answer. "noBank" shows all letters from A to Z.
export type Mode = keyof typeof text.guzzle.modes;

// The last move gives the status text. "null" means that the player did not move yet.
export type LastMove = { guess: Guess; index: number } | null;

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

// This hook keeps the game state: the mode, the guesses, the selected square and the mistakes.
export function useGame(answer: readonly string[], size: number, hooks: Hooks = {}) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [guesses, setGuesses] = useState(() =>
    Array.from<Guess | undefined>({ length: answer.length }),
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [lastMove, setLastMove] = useState<LastMove>(null);
  const isSolved = allGreen(answer, guesses);

  // This puts a letter in the selected square and checks it.
  // A green square does not change. The same wrong letter again does not add a mistake.
  function putLetter(letter: string) {
    if (mode === null || selected === null || isSolved) return;
    const current = guesses[selected];
    if (current?.mark === "correct" || current?.letter === letter) return;
    const guess: Guess = { letter, mark: checkLetter(answer, selected, letter) };
    const next = guesses.with(selected, guess);
    const nextMistakes = guess.mark === "correct" ? mistakes : mistakes + 1;
    hooks.onLetterPlaced?.({
      index: selected,
      letter,
      result: guess.mark,
      mistakes: nextMistakes,
    });
    setGuesses(next);
    setLastMove({ guess, index: selected });
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
    isSolved,
    putLetter,
    chooseMode,
    setSelected,
  };
}
