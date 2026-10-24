// The text of the home page. Each section of "src/app/pages/home/" has one part.
export const home = {
  hero: {
    eyebrow: "Free daily puzzles",
    title: "A new set of puzzles every day",
    intro:
      "Skardela has three new puzzle types: one for logic, one for words and one for light. Each type has an easy, a medium and a hard puzzle each day. Play in your browser. You do not need an account or a download.",
    play: "Play today's puzzles",
    howItWorks: "How it works",
    // The counts come from the puzzle data, so the facts stay correct when a puzzle type is added.
    factsLabel: "About Skardela",
    facts: {
      types: (count: number) => `${count} puzzle types`,
      daily: (count: number) => `${count} new puzzles each day`,
      free: "Free, with no account",
    },
  },
  today: {
    heading: "Today's puzzles",
    intro:
      "The puzzles change at midnight, your local time. All players get the same puzzles on the same date.",
    levelsLabel: (puzzleTypeName: string) => `Today's ${puzzleTypeName}`,
  },
  steps: {
    heading: "How it works",
    items: [
      {
        title: "Select a puzzle",
        body: "Each puzzle type has an easy, a medium and a hard puzzle for today. Start with easy to learn the rules.",
      },
      {
        title: "Play in your browser",
        body: "The rules are next to the board. Restart at any time, or get a random puzzle of the same level.",
      },
      {
        title: "Come back tomorrow",
        body: "New puzzles come each day at midnight, your local time.",
      },
    ],
  },
  faq: {
    heading: "Questions",
    items: [
      { question: "Is Skardela free?", answer: "Yes. All puzzles are free to play." },
      {
        question: "Do I need an account?",
        answer: "No. Skardela has no accounts. Open a puzzle and play.",
      },
      {
        question: "Does Skardela keep my progress?",
        answer:
          "No. A puzzle starts again when you reload the page. Skardela saves only your theme and your OK for the analytics notice.",
      },
      {
        question: "What data does Skardela collect?",
        answer:
          "Skardela uses analytics to count visits and to see which puzzles people play. The analytics tool does not use cookies, and it does not follow you to other websites.",
      },
      {
        question: "Can I help to make Skardela?",
        answer:
          "Yes. Skardela is open source. You can add puzzles, fix problems or add a new puzzle type.",
        link: { label: "Skardela on GitHub", href: "https://github.com/utk09-NCL/skardela" },
      },
    ],
  },
};
