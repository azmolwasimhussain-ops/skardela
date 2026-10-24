import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { readSettings, settingsStorageKey } from "../shared/settings";
import { text } from "../text/en";
import { ThemeSwitcher } from "./ThemeSwitcher";

afterEach(() => {
  delete document.documentElement.dataset.theme;
});

describe("theme switcher", () => {
  it("shows the saved theme and sets it on the page", () => {
    localStorage.setItem(settingsStorageKey, JSON.stringify({ theme: "dark" }));
    render(<ThemeSwitcher />);
    expect(screen.getByRole("combobox", { name: text.theme.label })).toHaveValue("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  // Chrome reports a form field without an "id" or a "name".
  it("gives the list a name", () => {
    render(<ThemeSwitcher />);
    expect(screen.getByRole("combobox", { name: text.theme.label })).toHaveAttribute(
      "name",
      "theme",
    );
  });

  it("changes and saves the theme, and keeps the other settings", async () => {
    localStorage.setItem(settingsStorageKey, JSON.stringify({ cookieBanner: true }));
    const user = userEvent.setup();
    render(<ThemeSwitcher />);
    const select = screen.getByRole("combobox", { name: text.theme.label });
    expect(select).toHaveValue("system");

    await user.selectOptions(select, text.theme.options.light);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(readSettings()).toEqual({ theme: "light", cookieBanner: true, solved: [] });

    await user.selectOptions(select, text.theme.options.system);
    expect(Object.hasOwn(document.documentElement.dataset, "theme")).toBe(false);
    expect(readSettings()).toEqual({ theme: "system", cookieBanner: true, solved: [] });
  });

  it("follows a theme change in a different tab", () => {
    render(<ThemeSwitcher />);
    act(() => {
      localStorage.setItem(settingsStorageKey, JSON.stringify({ theme: "dark" }));
      window.dispatchEvent(new StorageEvent("storage", { key: settingsStorageKey }));
    });
    expect(screen.getByRole("combobox", { name: text.theme.label })).toHaveValue("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
