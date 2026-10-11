export type Difficulty = "easy" | "medium" | "hard";

// The game keeps a simple order for each puzzle level.
// This order is used to build a stable progression across the project.
export const levels: readonly Difficulty[] = ["easy", "medium", "hard"];
