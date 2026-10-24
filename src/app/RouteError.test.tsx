import { createMemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { RouteError } from "./RouteError";
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { RouterProvider } from "react-router/dom";

function BrokenPage(): ReactNode {
  throw new Error("Test route error");
}

describe("RouteError", () => {
  it("shows the error page and logs the error to the console", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const router = createMemoryRouter([
      { path: "/", element: <BrokenPage />, errorElement: <RouteError /> },
    ]);
    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId("route-error-title")).toBeInTheDocument();
    const loggedValues = consoleErrorSpy.mock.calls.flat();
    expect(loggedValues).toContainEqual(new Error("Test route error"));
  });

  it("logs the status of an error response", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const router = createMemoryRouter([
      {
        path: "/",
        loader: () => {
          throw new Response(null, { status: 404, statusText: "Not Found" });
        },
        // A route with a loader needs a fallback for the first render, as the routes of the app have.
        // Without it, React Router warns when the first render comes before the loader ends.
        hydrateFallbackElement: <p>Loading</p>,
        element: <p>Never shown</p>,
        errorElement: <RouteError />,
      },
    ]);
    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId("route-error-title")).toBeInTheDocument();
    const loggedValues = consoleErrorSpy.mock.calls.flat();
    expect(loggedValues).toContain("Route error response");
    expect(loggedValues).toContainEqual({ status: 404, statusText: "Not Found" });
  });
});
