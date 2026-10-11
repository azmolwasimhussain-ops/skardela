import { useState, type CSSProperties, type KeyboardEvent } from "react";
import styles from "./Board.module.css";
import { lineOf, toSquares, type GuzzlePuzzle } from "./puzzle";
import {
  bankLetters,
  checkLetter,
  isPlayable,
  nextOpenSquare,
  isSolved as allGreen,
  type Guess,
} from "./rules-check";
import { text } from "../../../text/en";

const words = text.guzzle;

const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

type Mode = keyof typeof words.modes;

type GridStyle = CSSProperties & { "--size": number };

// The last move gives the status text. "null" means that the player did not move yet.
type LastMove = { guess: Guess; index: number } | null;

// The status text tells the player what to do, what the last letter did, or the result.
function statusText(
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

// This helper reads a letter from a physical keyboard. Other keys and shortcuts give no letter.
function letterFromKey(event: KeyboardEvent): string | undefined {
  if (event.ctrlKey || event.metaKey || event.altKey) return undefined;
  return /^[a-z]$/iu.test(event.key) ? event.key.toUpperCase() : undefined;
}

// This hook keeps the game state: the mode, the guesses, the selected square and the mistakes.
function useGame(answer: readonly string[], size: number) {
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
    setGuesses(next);
    setLastMove({ guess, index: selected });
    if (guess.mark === "correct") setSelected(nextOpenSquare(next, selected, size));
    else setMistakes(mistakes + 1);
  }

  // The player selects a mode before the first move. The first open square is then selected.
  function chooseMode(newMode: Mode) {
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

type SquareProps = {
  label: string;
  letter: string;
  guess: Guess | undefined;
  isFixed?: boolean;
  isSelected?: boolean;
  isLocked: boolean;
  onSelect?: () => void;
  onLetter?: (letter: string) => void;
};

// Each square on a word is a button. The player selects a square and then types a letter.
// The symbol shows the colour as a shape too, so the colour is not the only signal.
function SquareButton({
  label,
  letter,
  guess,
  isFixed = false,
  isSelected = false,
  isLocked,
  onSelect,
  onLetter,
}: SquareProps) {
  return (
    <button
      type="button"
      className={styles.square}
      data-mark={guess?.mark ?? "none"}
      data-fixed={isFixed}
      data-selected={isSelected}
      aria-label={label}
      aria-pressed={isFixed ? undefined : isSelected}
      aria-disabled={isLocked}
      onClick={() => {
        if (!isLocked) onSelect?.();
      }}
      onKeyDown={(event) => {
        const typed = letterFromKey(event);
        if (isLocked || typed === undefined) return;
        event.preventDefault();
        onLetter?.(typed);
      }}
    >
      <span aria-hidden="true">{letter}</span>
      {guess !== undefined && (
        <span aria-hidden="true" className={styles.symbol}>
          {words.symbols[guess.mark]}
        </span>
      )}
    </button>
  );
}

type GameProps = { answer: readonly string[]; size: number; game: ReturnType<typeof useGame> };

// One square of the grid: the fixed center letter, a square on a word or a gap.
// A gap is a square that is not on a word. It keeps the shape of the grid.
function GridSquare({ answer, size, game, index }: GameProps & { index: number }) {
  const isCenter = index === (size * size - 1) / 2;
  if (!isCenter && !isPlayable(index, size)) {
    return <span className={styles.gap} aria-hidden="true" />;
  }
  const guess = isCenter ? undefined : game.guesses[index];
  const letter = isCenter ? (answer[index] ?? "") : (guess?.letter ?? "");
  const label = words.square({
    row: Math.floor(index / size) + 1,
    column: (index % size) + 1,
    letter,
    mark: guess === undefined ? "" : words.marks[guess.mark],
    isFixed: isCenter,
  });
  return (
    <SquareButton
      label={label}
      letter={letter}
      guess={guess}
      isFixed={isCenter}
      isSelected={game.selected === index}
      isLocked={isCenter || game.mode === null || game.isSolved || guess?.mark === "correct"}
      onSelect={() => {
        game.setSelected(index);
      }}
      onLetter={game.putLetter}
    />
  );
}

// The grid shows all squares in rows and columns.
function Grid({ answer, size, game }: GameProps) {
  const gridStyle: GridStyle = { "--size": size };
  return (
    <div className={styles.grid} style={gridStyle}>
      {answer.map((_, index) => (
        // oxlint-disable-next-line react/no-array-index-key -- the index is the identity of a square. The squares never move.
        <GridSquare key={index} answer={answer} size={size} game={game} index={index} />
      ))}
    </div>
  );
}

// Before the first move, the player selects a mode. Then the player gets letter keys.
// With the bank, the keys are the letters that are not green yet. Without the bank, the keys are A to Z.
function Controls({ answer, game }: Omit<GameProps, "size">) {
  if (game.mode === null) {
    return (
      <fieldset className={styles.modes}>
        <legend className="visually-hidden">{words.modeLabel}</legend>
        {(Object.keys(words.modes) as Mode[]).map((option) => (
          <button
            key={option}
            type="button"
            className={styles.button}
            onClick={() => {
              game.chooseMode(option);
            }}
          >
            {words.modes[option]}
          </button>
        ))}
      </fieldset>
    );
  }

  const keys = game.mode === "bank" ? bankLetters(answer, game.guesses) : alphabet;
  return (
    <fieldset className={styles.keys} disabled={game.selected === null || game.isSolved}>
      <legend className="visually-hidden">
        {game.mode === "bank" ? words.bankLabel : words.keysLabel}
      </legend>
      {keys.map((letter, position) => (
        <button
          // oxlint-disable-next-line react/no-array-index-key -- the bank can have the same letter two times. The position makes the key unique.
          key={`${letter}-${position}`}
          type="button"
          className={styles.key}
          aria-label={words.key(letter)}
          onClick={() => {
            game.putLetter(letter);
          }}
        >
          {letter}
        </button>
      ))}
    </fieldset>
  );
}

// The board shows the grid, the mistake count, the status text and the letter keys.
// The puzzle is solved when all squares on the words are green.
export function Board({ puzzle }: { puzzle: GuzzlePuzzle }) {
  const answer = toSquares(puzzle.answer);
  const size = puzzle.answer.length;
  const game = useGame(answer, size);

  return (
    <div className={styles.game}>
      <fieldset className={styles.board}>
        <legend className="visually-hidden">{words.boardLabel}</legend>
        <Grid answer={answer} size={size} game={game} />
      </fieldset>

      <output className={styles.mistakes}>{words.mistakes(game.mistakes)}</output>

      <output className={styles.status} data-solved={game.isSolved}>
        {statusText(game.mode, game.lastMove, game.isSolved, game.mistakes, size)}
      </output>

      <Controls answer={answer} game={game} />
    </div>
  );
}
