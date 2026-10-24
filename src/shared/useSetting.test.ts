import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defaultSettings, readSettings, writeSetting } from "./settings";
import { useSetting } from "./useSetting";

afterEach(() => {
  vi.restoreAllMocks();
  // A failed write keeps the settings in memory. A good write removes them, so the next test starts clean.
  writeSetting("cookieBanner", defaultSettings.cookieBanner);
  localStorage.clear();
});

describe("useSetting", () => {
  it("gives the default value when nothing is saved", () => {
    const { result } = renderHook(() => useSetting("cookieBanner"));
    expect(result.current[0]).toBe(false);
  });

  it("saves a change, and all components that use the setting show the new value", () => {
    const first = renderHook(() => useSetting("cookieBanner"));
    const second = renderHook(() => useSetting("cookieBanner"));
    act(() => {
      first.result.current[1](true);
    });
    expect(first.result.current[0]).toBe(true);
    expect(second.result.current[0]).toBe(true);
    expect(readSettings().cookieBanner).toBe(true);
  });

  it("changes the value also when the browser blocks storage", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage is blocked", "SecurityError");
    });
    const { result } = renderHook(() => useSetting("cookieBanner"));
    act(() => {
      result.current[1](true);
    });
    expect(result.current[0]).toBe(true);
  });
});
