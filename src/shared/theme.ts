// The player can select the system theme, the light theme or the dark theme.
// "system" follows the setting of the device.
export const themes = ["system", "light", "dark"] as const;

export type Theme = (typeof themes)[number];

// The browser keeps the selected theme with this key.
// The script in "index.html" uses the same key. It sets the theme before the page shows, so the page does not flash.
export const themeStorageKey = "skardela-theme";

export function isTheme(value: unknown): value is Theme {
  return themes.includes(value as Theme);
}

// This reads the saved theme. If the value is not known, or if the browser blocks storage, it gives "system".
export function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(themeStorageKey);
    return isTheme(saved) ? saved : "system";
  } catch {
    return "system";
  }
}

// This sets the theme on the page. The CSS reads "data-theme" on <html>. See "src/index.css".
export function applyTheme(theme: Theme, root: HTMLElement = document.documentElement): void {
  if (theme === "system") delete root.dataset.theme;
  else root.dataset.theme = theme;
}

// This saves the theme for the next visit. If the browser blocks storage, the theme works only for this visit.
export function saveTheme(theme: Theme): void {
  try {
    if (theme === "system") localStorage.removeItem(themeStorageKey);
    else localStorage.setItem(themeStorageKey, theme);
  } catch {
    // The browser blocks storage. The theme still works until the page closes.
  }
}
