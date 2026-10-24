import { text } from "../../../text/en";
import { endSquare, pathParts, type Beam } from "./rules-check";
import type { Game } from "./useGame";

const words = text.latics;

// "row 2, column 5" for a square index.
function at(index: number, size: number): string {
  return words.at(Math.floor(index / size) + 1, (index % size) + 1);
}

// The end of the beam in words, for example "A wall at row 2, column 5 stops the beam."
export function endText(beam: Beam, size: number): string {
  return words.ends[beam.end](at(endSquare(beam), size));
}

// The full path of the beam in words, one sentence for each part, and then the end.
// The path helps a player who cannot see the beam, and each player who wants to check the angles.
export function pathText(beam: Beam, size: number): string[] {
  const parts = pathParts(beam).map((part) =>
    part.kind === "move"
      ? words.path.move(words.directions[part.direction], part.squares)
      : words.path.turn(
          Math.floor(part.index / size) + 1,
          (part.index % size) + 1,
          words.directions[part.direction],
        ),
  );
  return [...parts, endText(beam, size)];
}

// The status text tells the player the result, where the beam ends, or what to do.
export function statusText(game: Game): string {
  if (game.isSolved) {
    return game.config.liveBeam ? words.status.solved : words.status.solvedWithMisses(game.misses);
  }
  if (game.beam !== null) return endText(game.beam, game.size);
  return words.status.plan({ tray: game.config.tray > 0, aim: game.config.canAim });
}
