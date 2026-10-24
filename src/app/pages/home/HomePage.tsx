import { useLoaderData } from "react-router";
import { text } from "../../../text/en";
import type { homeLoader } from "../../puzzles";
import { Faq } from "./Faq";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { TodayPuzzles } from "./TodayPuzzles";

// The home page tells a new player what Skardela is, and takes each player to the puzzles of today.
// Each section is in its own file in this folder. All sections use "HomePage.module.css".
// The order: what Skardela is, today's puzzles, how it works and the questions.
export function HomePage() {
  const cards = useLoaderData<typeof homeLoader>();
  const dailyCount = cards.reduce((count, card) => count + card.levels.length, 0);
  return (
    <>
      <title>{text.siteName}</title>
      <Hero typeCount={cards.length} dailyCount={dailyCount} />
      <TodayPuzzles cards={cards} />
      <HowItWorks />
      <Faq />
    </>
  );
}
