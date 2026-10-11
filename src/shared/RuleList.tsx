import styles from "./RuleList.module.css";

// A rule is a text. A rule can also show a small sample square, for example the green square of Guzzle.
// The sample shows the colour and the symbol. The text says the colour too, for a screen reader.
export type Rule =
  | string
  | { text: string; sample: { fill: "green" | "yellow" | "red"; symbol: string } };

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
            <span className={styles.sample} data-fill={rule.sample.fill} aria-hidden="true">
              {rule.sample.symbol}
            </span>
            {rule.text}
          </li>
        ),
      )}
    </ol>
  );
}
