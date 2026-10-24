import { useSyncExternalStore } from "react";
import {
  readSettings,
  subscribeToSettings,
  writeSetting,
  type SettingName,
  type Settings,
} from "./settings";

// This hook reads one setting and gives a function that changes it. It works like "useState",
// but the browser keeps the value for the next visit. See "settings.ts".
// All components that use the same setting show the same value, also after a change in a different tab.
// It never throws: when the browser blocks storage, the setting works until the page closes.
export function useSetting<Name extends SettingName>(
  name: Name,
): readonly [Settings[Name], (value: Settings[Name]) => void] {
  // React compares the value with "Object.is", thus the same value does not render the component again.
  // "readSettings" gives the same object while the stored text is the same, thus a list setting is the same array.
  const value = useSyncExternalStore(subscribeToSettings, () => readSettings()[name]);
  const setValue = (next: Settings[Name]) => {
    writeSetting(name, next);
  };
  return [value, setValue];
}
