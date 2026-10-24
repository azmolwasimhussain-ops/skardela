import { flush } from "@utk09/ui-observability";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getLogger } from "./logger";

// Vitest reports an "error" event on the window as a failure when no listener handles it.
// This listener handles it, as the browser does when it prints the error.
function handle() {}

// The lines that the library prints start with this format: "[namespace][LEVEL]".
function libraryLines(spy: { mock: { calls: unknown[][] } }) {
  return spy.mock.calls.filter(([format]) => String(format).startsWith("%c[%s]"));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("logger", () => {
  it("does not print an uncaught error or a rejection a second time", async () => {
    const printed = vi.spyOn(console, "error").mockImplementation(() => {});
    // A log call starts the runtime. "flush" waits until the runtime has started.
    getLogger("test.logger").debug("start");
    await flush();

    window.addEventListener("error", handle);
    window.dispatchEvent(new ErrorEvent("error", { message: "boom", error: new Error("boom") }));
    window.removeEventListener("error", handle);
    const rejection = Object.assign(new Event("unhandledrejection"), {
      reason: new Error("no"),
      promise: Promise.resolve(),
    });
    window.dispatchEvent(rejection);
    await flush();

    expect(libraryLines(printed)).toEqual([]);
  });

  it("prints an error that the app logs", async () => {
    const printed = vi.spyOn(console, "error").mockImplementation(() => {});
    getLogger("test.logger").error("The app logs this error", new Error("boom"));
    await flush();
    expect(libraryLines(printed)).toHaveLength(1);
  });
});
