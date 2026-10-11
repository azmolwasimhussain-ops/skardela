import { afterEach, describe, expect, it, vi } from "vitest";
import indexHtml from "../../index.html?raw";
import { applyTheme, readTheme, saveTheme, themeStorageKey } from "./theme";

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe("theme", () => {
  it("gives the system theme when no theme is saved or the saved value is not known", () => {
    expect(readTheme()).toBe("system");
    localStorage.setItem(themeStorageKey, "purple");
    expect(readTheme()).toBe("system");
  });

  it("saves and reads a theme", () => {
    saveTheme("dark");
    expect(readTheme()).toBe("dark");
    saveTheme("system");
    expect(localStorage.getItem(themeStorageKey)).toBeNull();
  });

  it("gives the system theme when the browser blocks storage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage is blocked");
    });
    expect(readTheme()).toBe("system");
  });

  it("sets data-theme on the page, and removes it for the system theme", () => {
    applyTheme("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    applyTheme("system");
    expect(Object.hasOwn(document.documentElement.dataset, "theme")).toBe(false);
  });

  it("uses the same storage key as the script in index.html", () => {
    expect(indexHtml).toContain(`localStorage.getItem("${themeStorageKey}")`);
  });
});
