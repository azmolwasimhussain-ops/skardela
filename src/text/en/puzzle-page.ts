// The text of the puzzle page that is the same for each puzzle type.
// The text of each puzzle type is in its own file in this folder.
export const puzzlePage = {
  title: (puzzleTypeName: string, id: string, siteName: string) =>
    `${puzzleTypeName} ${id} | ${siteName}`,
  detailsLabel: "Puzzle details",
  // The details under the title have no labels. The words "#" and "by" are enough.
  puzzleNumber: (number: string) => `#${number}`,
  author: (author: string) => `by ${author}`,
  rulesHeading: "Rules",
  loading: "The puzzle is loading...",
  loadingBoard: "The board is loading...",
  boardError: "An error stopped the board. Reload the page to try again.",
  // The bar above the rules. "Restart" asks one time before it deletes the moves.
  restart: "Restart",
  restartQuestion: "Restart the puzzle?",
  // Each answer shows a short text. The label tells a screen reader what the answer does.
  restartYes: { text: "Yes", label: "Yes, restart the puzzle" },
  restartNo: { text: "No", label: "No, keep playing" },
  random: "Random puzzle",
};
