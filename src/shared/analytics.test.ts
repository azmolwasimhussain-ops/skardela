import { afterEach, describe, expect, it } from "vitest";
import { loadAnalytics, umami } from "./analytics";

function analyticsScripts() {
  return document.head.querySelectorAll(`script[src="${umami.src}"]`);
}

afterEach(() => {
  for (const script of analyticsScripts()) script.remove();
});

describe("loadAnalytics", () => {
  it("adds the Umami script with the website ID one time", () => {
    loadAnalytics();
    loadAnalytics();
    const scripts = analyticsScripts();
    expect(scripts).toHaveLength(1);
    expect(scripts[0]).toHaveAttribute("data-website-id", umami.websiteId);
    expect(scripts[0]).toHaveProperty("defer", true);
  });
});
