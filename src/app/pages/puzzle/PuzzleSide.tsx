import { RuleList } from "../../../shared/RuleList";
import { text } from "../../../text/en";
import type { LoadedPuzzle } from "../../puzzles";
import { PuzzleActions } from "./PuzzleActions";
import styles from "./PuzzlePage.module.css";
import { SolvedCard } from "./SolvedCard";

// The side column of the panel: the solved card after a solve, the actions, then the rules.
export function PuzzleSide({ loaded, onRestart }: { loaded: LoadedPuzzle; onRestart: () => void }) {
  const { type, puzzle } = loaded;
  return (
    <div className={styles.side}>
      <SolvedCard puzzleId={puzzle.id} type={type} difficulty={puzzle.difficulty} />
      <PuzzleActions loaded={loaded} onRestart={onRestart} />
      <section aria-labelledby="rules-heading" className={styles.rules}>
        <h2 id="rules-heading">{text.puzzlePage.rulesHeading}</h2>
        <RuleList rules={text[type].rules} />
      </section>
    </div>
  );
}
