import { useState } from "react";
import { applyTheme, isTheme, readTheme, saveTheme, themes } from "../shared/theme";
import { getLogger } from "../shared/logger";
import { text } from "../text/en";
import styles from "./ThemeSwitcher.module.css";

// This list lets the player select the system theme, the light theme or the dark theme.
// A native <select> works with a keyboard and a screen reader without more code.
export function ThemeSwitcher() {
  const [theme, setTheme] = useState(readTheme);
  const log = getLogger("ui.theme-switcher");

  return (
    <label className={styles.switcher}>
      <span className="visually-hidden">{text.theme.label}</span>
      <select
        className={styles.select}
        value={theme}
        onChange={(event) => {
          const selected = event.target.value;
          if (!isTheme(selected)) return;
          // This log helps us track user theme changes during a session.
          log.info("Theme changed", { theme: selected });
          setTheme(selected);
          applyTheme(selected);
          saveTheme(selected);
        }}
      >
        {themes.map((option) => (
          <option key={option} value={option}>
            {text.theme.options[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
