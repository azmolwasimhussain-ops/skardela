import { describe, expect, it } from "vitest";
import { cipherAnswer, decipherAnswer, decodeText, encodeText } from "./cipher";

describe("answer cipher", () => {
  it("decodes the text that it encodes", () => {
    const code = encodeText("RBP/CAT/MGN", "guzzle-0001");
    expect(code).not.toContain("CAT");
    expect(decodeText(code, "guzzle-0001")).toBe("RBP/CAT/MGN");
  });

  it("gives a different code for a different puzzle ID", () => {
    expect(encodeText("CAT", "guzzle-0001")).not.toBe(encodeText("CAT", "guzzle-0002"));
  });

  it("removes the readable answer from a puzzle and puts it back", () => {
    const puzzle = { id: "colour-binary-0001", difficulty: "easy", answer: ["RB", "BR"] };
    const ciphered = cipherAnswer(puzzle);
    expect(ciphered).not.toHaveProperty("answer");
    expect(JSON.stringify(ciphered)).not.toContain('["RB","BR"]');
    expect(decipherAnswer<typeof puzzle>(ciphered)).toEqual(puzzle);
  });
});
