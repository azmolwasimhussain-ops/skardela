import { isTheme, type Theme } from "./theme";

// The browser keeps all settings of Skardela in one localStorage item, as one JSON object.
// Use "useSetting" in "useSetting.ts" to read and change a setting in a component.
// The script in "index.html" reads the theme before the page shows. It must use the same key and field names.

export const settingsStorageKey = "skardela.netlify.app";

export type Settings = {
  // The theme that the player selected. "system" follows the setting of the device.
  readonly theme: Theme;
  // True after the player selected OK on the analytics notice. Then the notice does not show again.
  readonly cookieBanner: boolean;
  // The IDs of the puzzles that the player solved. "Random puzzle" skips them. See "useRecordSolved.ts".
  readonly solved: readonly string[];
};

export type SettingName = keyof Settings;

export const defaultSettings: Settings = { theme: "system", cookieBanner: false, solved: [] };

// Each field has a check. A field with a value that is not correct gets its default value,
// thus a broken or an old value in the storage does not break the app.
// To add a setting, add it to "Settings", "defaultSettings" and "checks".
const checks: { [Name in SettingName]: (value: unknown) => value is Settings[Name] } = {
  theme: isTheme,
  cookieBanner: (value): value is boolean => typeof value === "boolean",
  solved: (value): value is readonly string[] =>
    Array.isArray(value) && value.every((id) => typeof id === "string"),
};

// This makes correct settings from a JSON text. Text that is not JSON, or JSON that is not an object,
// gives the default settings.
export function parseSettings(json: string | null): Settings {
  let stored: unknown = null;
  try {
    stored = JSON.parse(json ?? "null");
  } catch {
    // The text is not JSON. The default settings are used.
  }
  const fields: Partial<Record<string, unknown>> =
    typeof stored === "object" && stored !== null && !Array.isArray(stored) ? stored : {};
  const fieldOr = <Name extends SettingName>(name: Name): Settings[Name] => {
    const value = fields[name];
    return checks[name](value) ? value : defaultSettings[name];
  };
  return {
    theme: fieldOr("theme"),
    cookieBanner: fieldOr("cookieBanner"),
    solved: fieldOr("solved"),
  };
}

// When the browser blocks storage, or the storage is full, the settings stay here until the page closes.
// Thus the theme and the OK on the analytics notice still work on this page.
let memory: Settings | null = null;

// The last stored text and its settings. While the text is the same, "readSettings" gives the same object.
// Thus a list setting, such as "solved", is the same array, and React does not render again for it.
let cache: { json: string | null; settings: Settings } | null = null;

// This reads all settings. It never throws.
export function readSettings(): Settings {
  if (memory !== null) return memory;
  try {
    const json = localStorage.getItem(settingsStorageKey);
    if (cache?.json !== json) cache = { json, settings: parseSettings(json) };
    return cache.settings;
  } catch {
    return defaultSettings;
  }
}

const listeners = new Set<() => void>();

// This changes one setting and keeps the other settings. It never throws.
export function writeSetting<Name extends SettingName>(name: Name, value: Settings[Name]): void {
  const next: Settings = { ...readSettings(), [name]: value };
  try {
    localStorage.setItem(settingsStorageKey, JSON.stringify(next));
    memory = null;
  } catch {
    memory = next;
  }
  for (const listener of listeners) listener();
}

// This calls "listener" after each change of the settings: a change on this page,
// or a change in a different tab of the same site. It gives a function that stops the calls.
export function subscribeToSettings(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    // "key" is null when a tab clears all storage.
    if (event.key === null || event.key === settingsStorageKey) listener();
  };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
