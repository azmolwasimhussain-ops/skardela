import { text } from "../../../text/en";
import styles from "./HomePage.module.css";

const words = text.home.hero;

// The colours of the small board in the hero. The board is only decoration.
const tiles = [
  ["red", "blue", "blue", "red"],
  ["blue", "accent", "red", "blue"],
  ["red", "blue", "green", "yellow"],
  ["blue", "red", "yellow", "red"],
].flat();

// The first section: what Skardela is, the main action and three short facts.
// The counts come from the puzzle data, so the facts stay correct when a puzzle type is added.
export function Hero({ typeCount, dailyCount }: { typeCount: number; dailyCount: number }) {
  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.heroText}>
        <p className={styles.eyebrow}>{words.eyebrow}</p>
        <h1 id="home-title" data-testid="home-page-title" className={styles.heroTitle}>
          {words.title}
        </h1>
        <p className={styles.intro}>{words.intro}</p>
        <div className={styles.ctas}>
          <a className={styles.primary} href="#today">
            {words.play}
          </a>
          <a className={styles.secondary} href="#how-it-works">
            {words.howItWorks}
          </a>
        </div>
        <ul className={styles.facts} aria-label={words.factsLabel}>
          <li>{words.facts.types(typeCount)}</li>
          <li>{words.facts.daily(dailyCount)}</li>
          <li>{words.facts.free}</li>
        </ul>
      </div>
      <div className={styles.mosaic} aria-hidden="true">
        {tiles.map((colour, index) => (
          // oxlint-disable-next-line react/no-array-index-key -- the tiles never move in the list.
          <span key={index} className={styles.tile} data-colour={colour} />
        ))}
      </div>
    </section>
  );
}
