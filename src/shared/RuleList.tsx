import styles from "./RuleList.module.css";

// The fill of a small sample square. "empty" is an outline only.
type SampleFill = "green" | "yellow" | "red" | "blue" | "empty";

// A sample shows the colour and the symbol of a game square. "isGiven" adds the dot of a given square.
type Sample = { fill: SampleFill; symbol: string; isGiven?: boolean };

// A rule is a text. A rule can also show a small sample square, for example the green square of Guzzle.
// The sample shows the colour and the symbol. The text says the colour too, for a screen reader.
export type Rule = string | { text: string; sample: Sample };

// One item of a key: a sample square and a short text that tells what it means.
export type KeyItem = { text: string; sample: Sample };

function SampleSquare({ sample }: { sample: Sample }) {
  return (
    <span
      className={styles.sample}
      data-fill={sample.fill}
      data-given={sample.isGiven === true}
      aria-hidden="true"
    >
      {sample.symbol}
    </span>
  );
}

// This list shows the rules of a puzzle type.
// All puzzle types use it, so each type only gives its rule text.
export function RuleList({ rules }: { rules: readonly Rule[] }) {
  return (
    <ol className={styles.rules}>
      {rules.map((rule) =>
        typeof rule === "string" ? (
          <li key={rule}>{rule}</li>
        ) : (
          <li key={rule.text}>
            <SampleSquare sample={rule.sample} />
            {rule.text}
          </li>
        ),
      )}
    </ol>
  );
}

// This list shows a key: small chips with a sample square and its meaning, for example "correct".
// The text tells the meaning, so the colour is not the only signal. An empty key shows nothing.
export function KeyList({ items, label }: { items: readonly KeyItem[]; label: string }) {
  if (items.length === 0) return null;
  return (
    <ul className={styles.key} aria-label={label}>
      {items.map((item) => (
        <li key={item.text} className={styles.keyItem}>
          <SampleSquare sample={item.sample} />
          {item.text}
        </li>
      ))}
    </ul>
  );
}
