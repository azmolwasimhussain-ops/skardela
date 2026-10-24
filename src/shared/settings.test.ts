import { afterEach, describe, expect, it, vi } from "vitest";
import indexHtml from "../../index.html?raw";
import {
  defaultSettings,
  parseSettings,
  readSettings,
  settingsStorageKey,
  subscribeToSettings,
  writeSetting,
} from "./settings";

function blocked(): never {
  throw new DOMException("Storage is blocked", "SecurityError");
}

// This helper makes the storage throw, as a browser does when it blocks storage.
function blockStorage() {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(blocked);
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(blocked);
}

afterEach(() => {
  vi.restoreAllMocks();
  // A failed write keeps the settings in memory. A good write removes them, so the next test starts clean.
  writeSetting("theme", defaultSettings.theme);
  localStorage.clear();
});

describe("parseSettings", () => {
  it("gives the default settings for no value, for text that is not JSON and for JSON that is not an object", () => {
    for (const json of [null, "", "{", "null", "42", '"dark"', "[]", '["dark", true]']) {
      expect(parseSettings(json)).toEqual(defaultSettings);
    }
  });

  it("keeps each correct field, and gives the default value for each field that is not correct", () => {
    expect(parseSettings('{"theme":"dark","cookieBanner":true,"solved":["guzzle-0001"]}')).toEqual({
      theme: "dark",
      cookieBanner: true,
      solved: ["guzzle-0001"],
    });
    expect(parseSettings('{"theme":"purple","cookieBanner":true}')).toEqual({
      theme: "system",
      cookieBanner: true,
      solved: [],
    });
    expect(parseSettings('{"theme":"light","cookieBanner":"yes","other":1}')).toEqual({
      theme: "light",
      cookieBanner: false,
      solved: [],
    });
  });

  it.each(['"guzzle-0001"', "{}", '["guzzle-0001", 2]', "[null]"])(
    "gives an empty list of solved puzzles for the value %s",
    (value) => {
      expect(parseSettings(`{"solved":${value}}`).solved).toEqual([]);
    },
  );
});

describe("settings in the storage", () => {
  it("saves all settings as one JSON object under one key", () => {
    writeSetting("cookieBanner", true);
    writeSetting("theme", "dark");
    expect(JSON.parse(String(localStorage.getItem(settingsStorageKey)))).toEqual({
      theme: "dark",
      cookieBanner: true,
      solved: [],
    });
    expect(readSettings()).toEqual({ theme: "dark", cookieBanner: true, solved: [] });
  });

  it("keeps the settings in memory when the browser blocks storage", () => {
    blockStorage();
    expect(readSettings()).toEqual(defaultSettings);
    expect(() => {
      writeSetting("cookieBanner", true);
    }).not.toThrow();
    expect(readSettings()).toEqual({ theme: "system", cookieBanner: true, solved: [] });
  });

  it("keeps the settings in memory when the storage is full", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("The storage is full", "QuotaExceededError");
    });
    writeSetting("theme", "light");
    expect(readSettings().theme).toBe("light");
  });

  it("tells each listener about a change on this page and in a different tab, until it stops", () => {
    const listener = vi.fn<() => void>();
    const stop = subscribeToSettings(listener);
    writeSetting("theme", "dark");
    window.dispatchEvent(new StorageEvent("storage", { key: settingsStorageKey }));
    window.dispatchEvent(new StorageEvent("storage", { key: null }));
    window.dispatchEvent(new StorageEvent("storage", { key: "a-different-key" }));
    expect(listener).toHaveBeenCalledTimes(3);

    stop();
    writeSetting("theme", "light");
    window.dispatchEvent(new StorageEvent("storage", { key: settingsStorageKey }));
    expect(listener).toHaveBeenCalledTimes(3);
  });
});

describe("readSettings", () => {
  // React reads a setting at each render. A new array each time would render the component again and again.
  it("gives the same object while the stored text is the same, and a new object after a change", () => {
    writeSetting("solved", ["latics-0001"]);
    const first = readSettings();
    expect(readSettings()).toBe(first);
    expect(readSettings().solved).toBe(first.solved);
    writeSetting("solved", ["latics-0001", "latics-0002"]);
    expect(readSettings()).not.toBe(first);
    expect(readSettings().solved).toEqual(["latics-0001", "latics-0002"]);
  });
});

// The script in index.html runs before the app. It sets the saved theme, so the page does not flash.
describe("the theme script in index.html", () => {
  const source = /<script>([\s\S]*?)<\/script>/u.exec(indexHtml)?.[1] ?? "";
  // The test runs the script from index.html as the browser does.
  const runScript = new Function(source) as () => void;

  afterEach(() => {
    delete document.documentElement.dataset.theme;
  });

  it("sets the theme that the app saved", () => {
    writeSetting("theme", "dark");
    runScript();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("sets no theme when nothing is saved", () => {
    expect(runScript).not.toThrow();
    expect(Object.hasOwn(document.documentElement.dataset, "theme")).toBe(false);
  });

  it.each([JSON.stringify(defaultSettings), "{", "[]", '{"theme":"purple"}'])(
    "sets no theme for the saved value %j",
    (json) => {
      localStorage.setItem(settingsStorageKey, json);
      expect(runScript).not.toThrow();
      expect(Object.hasOwn(document.documentElement.dataset, "theme")).toBe(false);
    },
  );
});
