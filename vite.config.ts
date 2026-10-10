/// <reference types="vitest/config" />
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig, type Plugin } from "vite";

const missingPeers = new Set(["web-vitals", "@opentelemetry/api"]);
const missingPeerPrefix = "\0missing-peer:";

function stubMissingPeers(): Plugin {
  return {
    name: "stub-missing-peers",
    enforce: "pre",
    resolveId(id) {
      return missingPeers.has(id) ? missingPeerPrefix + id : null;
    },
    load(id) {
      if (!id.startsWith(missingPeerPrefix)) return null;
      const name = id.slice(missingPeerPrefix.length);
      return `throw new Error(${JSON.stringify(`${name} is not installed`)});`;
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [stubMissingPeers(), react(), babel({ presets: [reactCompilerPreset()] })],
  build: {
    sourcemap: false,
  },
  test: {
    restoreMocks: true,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: ["./src/test/setup.ts"],
          include: ["src/**/*.test.{ts,tsx}"],
        },
      },
      {
        extends: true,
        test: {
          name: "validate",
          environment: "node",
          include: ["tools/**/*.test.ts"],
        },
      },
    ],
  },
});
