import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { themeStorageKey } from "../shared/theme";
import { text } from "../text/en";
import { ThemeSwitcher } from "./ThemeSwitcher";

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe("theme switcher", () => {
  it("shows the saved theme", () => {
    localStorage.setItem(themeStorageKey, "dark");
    render(<ThemeSwitcher />);
    expect(screen.getByRole("combobox", { name: text.theme.label })).toHaveValue("dark");
  });

  it("changes and saves the theme", async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher />);
    const select = screen.getByRole("combobox", { name: text.theme.label });
    expect(select).toHaveValue("system");

    await user.selectOptions(select, text.theme.options.light);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(themeStorageKey)).toBe("light");

    await user.selectOptions(select, text.theme.options.system);
    expect(Object.hasOwn(document.documentElement.dataset, "theme")).toBe(false);
    expect(localStorage.getItem(themeStorageKey)).toBeNull();
  });
});
