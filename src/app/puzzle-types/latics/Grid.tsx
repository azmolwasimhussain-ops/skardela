import { gridStyle } from "../../../shared/grid";
import shared from "../../../shared/Board.module.css";
import { text } from "../../../text/en";
import styles from "./Board.module.css";
import { directions, isMirror, mirrors, type Direction, type Mirror, type Square } from "./puzzle";
import { beamLines, steps } from "./rules-check";
import type { Game } from "./useGame";

const words = text.latics;

// Each square has a drawing in a box from −50 to 50. The middle of the square is at 0, 0.
// A beam line goes a little past the side of the square, so the lines of two squares meet in the gap.
const beamLength = 58;
const mirrorLength = 38;
const barrelLength = 40;

// A line from "from" to "to" times the step of the direction.
// A beam line uses the step as it is, so a diagonal line goes to the corner of the square.
function Line({ direction, from = 0, to }: { direction: Direction; from?: number; to: number }) {
  const { row, column } = steps[direction];
  return <line x1={column * from} y1={row * from} x2={column * to} y2={row * to} />;
}

// A diagonal step is √2 long. This gives the multiplier for a line of the given length in the direction,
// so a diagonal mirror or laser has the same length as a straight one.
function reach(direction: Direction, length: number): number {
  const { row, column } = steps[direction];
  return row !== 0 && column !== 0 ? length / Math.SQRT2 : length;
}

// A mirror at the angle m goes in the direction m, and in the opposite direction.
function mirrorDirection(mirror: Mirror): Direction {
  return directions[mirrors.indexOf(mirror)] as Direction;
}

type ArtProps = { square: Square; laser: Direction; lines: readonly Direction[] };

// The drawing of one square: the beam lines under the piece, then the mirror or the laser.
// The drawing is only decoration. The label of the square gives the same information.
function SquareArt({ square, laser, lines }: ArtProps) {
  return (
    <svg className={styles.art} viewBox="-50 -50 100 100" aria-hidden="true">
      <g className={styles.beam}>
        {lines.map((direction) => (
          <Line key={direction} direction={direction} to={beamLength} />
        ))}
      </g>
      {isMirror(square) && (
        <g className={styles.mirror}>
          <Line
            direction={mirrorDirection(square)}
            from={-reach(mirrorDirection(square), mirrorLength)}
            to={reach(mirrorDirection(square), mirrorLength)}
          />
        </g>
      )}
      {square === "L" && (
        <g className={styles.laser}>
          <Line direction={laser} to={reach(laser, barrelLength)} />
          <circle r={18} />
        </g>
      )}
    </svg>
  );
}

type SquareProps = { game: Game; index: number; lines: readonly Direction[] };

// Each square is a button. The player selects a square to change its piece.
// A square that the player cannot change has "aria-disabled", so a screen reader can still read it.
function SquareButton({ game, index, lines }: SquareProps) {
  const size = game.size;
  const square = game.squares[index] ?? ".";
  const isFromTray = game.fromTray.includes(index);
  const isHit = square === "M" && game.isSolved;
  const canSelect = game.canSelect(index);
  const label = words.square({
    row: Math.floor(index / size) + 1,
    column: (index % size) + 1,
    piece: words.pieces[square],
    laser: square === "L" ? words.directions[game.laser] : "",
    isFromTray,
    isHit,
  });

  return (
    <button
      type="button"
      className={`${shared.square} ${styles.square}`}
      data-square={square}
      data-from-tray={isFromTray}
      data-hit={isHit}
      aria-label={label}
      aria-disabled={!canSelect}
      onClick={() => {
        game.select(index);
      }}
    >
      <SquareArt square={square} laser={game.laser} lines={lines} />
      {square === "M" && (
        <span aria-hidden="true" className={styles.monster}>
          {words.symbols.monster}
        </span>
      )}
      {isHit && (
        <span aria-hidden="true" className={styles.hit}>
          {words.symbols.hit}
        </span>
      )}
    </button>
  );
}

// The grid shows all squares in rows and columns, with the beam when the game shows it.
export function Grid({ game }: { game: Game }) {
  const lines = game.beam === null ? new Map<number, Direction[]>() : beamLines(game.beam);
  return (
    <div className={shared.grid} style={gridStyle(game.size)}>
      {game.squares.map((_, index) => (
        <SquareButton
          // oxlint-disable-next-line react/no-array-index-key -- the index is the identity of a square. The squares never move.
          key={index}
          game={game}
          index={index}
          lines={lines.get(index) ?? []}
        />
      ))}
    </div>
  );
}
