import type { LoadedPuzzle } from "../../puzzles";
import { PuzzleActions } from "./PuzzleActions";
import styles from "./PuzzlePage.module.css";
import { PuzzleRules } from "./PuzzleRules";
import { SolvedCard } from "./SolvedCard";

// The side column of the panel: the result card after a solve, the actions, then the rules.
// The rules have the type as key, so a different puzzle type gets a new rules panel.
export function PuzzleSide({ loaded, onRestart }: { loaded: LoadedPuzzle; onRestart: () => void }) {
  return (
    <div className={styles.side}>
      <SolvedCard loaded={loaded} />
      <PuzzleActions loaded={loaded} onRestart={onRestart} />
      <PuzzleRules key={loaded.type} type={loaded.type} />
    </div>
  );
}
