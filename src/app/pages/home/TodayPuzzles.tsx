import { Link } from "react-router";
import type { Difficulty } from "../../../shared/difficulty";
import { bestTime, formatDuration } from "../../../shared/progress";
import { useAppStore } from "../../../shared/store";
import { text } from "../../../text/en";
import type { TodayCard } from "../../puzzles";
import styles from "./HomePage.module.css";
import { PuzzleIcon } from "./PuzzleIcon";

const words = text.home.today;

type LevelProps = {
  id: string;
  difficulty: Difficulty;
  isSolved: boolean;
  best: number | undefined;
  isNext: boolean;
};

// A link to the puzzle of one level, with its status: the best time of a solved puzzle, or "not solved".
// The next level to play has a ring.
function LevelLink({ id, difficulty, isSolved, best, isNext }: LevelProps) {
  const level = text.levels[difficulty];
  const time = best === undefined ? undefined : formatDuration(best);
  const notSolvedOr = (solvedText: string) => (isSolved ? solvedText : words.notSolved);
  const status = notSolvedOr(time === undefined ? words.solvedNoTime : words.solvedIn(time));
  return (
    <Link
      className={styles.level}
      data-solved={isSolved}
      data-next={isNext}
      to={`/puzzles/${id}`}
      aria-label={words.levelLink(level, time, isSolved)}
    >
      <span className={styles.levelName}>{level}</span>
      <span className={styles.levelStatus}>{status}</span>
    </Link>
  );
}

// One card for each puzzle type, with a link to today's puzzle of each level.
// The main link goes to the first level that the player did not solve.
function Card({ card }: { card: TodayCard }) {
  const solved = useAppStore((state) => state.solved);
  const results = useAppStore((state) => state.results);
  const { type, levels } = card;
  const { name, summary } = text[type];
  const next = levels.find(({ id }) => !solved.includes(id));
  return (
    <li className={styles.card}>
      <div className={styles.cardHead}>
        <PuzzleIcon type={type} />
        <div className={styles.cardText}>
          <h3 className={styles.cardTitle}>{name}</h3>
          <p className={styles.summary}>{summary}</p>
        </div>
      </div>
      <nav aria-label={words.levelsLabel(name)}>
        <ul className={styles.levels}>
          {levels.map(({ id, difficulty }) => (
            <li key={id}>
              <LevelLink
                id={id}
                difficulty={difficulty}
                isSolved={solved.includes(id)}
                best={bestTime(results, id)}
                isNext={next?.id === id}
              />
            </li>
          ))}
        </ul>
      </nav>
      {next === undefined ? (
        <p className={styles.allSolved}>{words.allSolved}</p>
      ) : (
        <Link className={styles.cta} to={`/puzzles/${next.id}`}>
          {words.play(text.levels[next.difficulty])}
        </Link>
      )}
    </li>
  );
}

export function TodayPuzzles({ cards }: { cards: readonly TodayCard[] }) {
  return (
    <section
      id="today"
      data-testid="puzzle-types-section"
      aria-labelledby="today-heading"
      className={styles.section}
    >
      <div className={styles.sectionHeader}>
        <h2 id="today-heading">{words.heading}</h2>
        <p className={styles.sectionIntro}>{words.intro}</p>
      </div>
      <ul className={styles.cards}>
        {cards.map((card) => (
          <Card key={card.type} card={card} />
        ))}
      </ul>
    </section>
  );
}
