/// <reference types="vitest/config" />
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig, type Plugin } from "vite";
// The import has the file extension, because Vite loads the config with native imports.
import { cipherAnswer } from "./src/shared/cipher.ts";

// The files in "puzzles/" have readable answers, so contributors can easily write and check puzzles.
// This plugin ciphers each answer when Vite loads a puzzle file, in the build, the dev server and the tests.
// Thus the browser gets no readable answers. "src/shared/cipher.ts" tells how the cipher works.
// "enforce: pre" runs the plugin before the JSON plugin of Vite, so the plugin gets the JSON text.
function cipherPuzzleAnswers(): Plugin {
  return {
    name: "skardela:cipher-puzzle-answers",
    enforce: "pre",
    transform(code, id) {
      if (!/\/puzzles\/[a-z-]+\.json$/u.test(id)) return null;
      const puzzles = JSON.parse(code) as { id: string; answer: string[] }[];
      return { code: JSON.stringify(puzzles.map((puzzle) => cipherAnswer(puzzle))), map: null };
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [cipherPuzzleAnswers(), react(), babel({ presets: [reactCompilerPreset()] })],
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
