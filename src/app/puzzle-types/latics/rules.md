# Latics

## Rules

Hit the monster 👾 with the laser beam. The beam goes in a straight line: across, up and down, or diagonally. It goes through the middle of each square.

A mirror turns the beam. The angle in is the same as the angle out (the law of reflection). A beam that goes along a mirror does not change. A wall stops the beam. The beam also stops when it goes off the board or back into the laser.

Select a mirror to turn it 45° clockwise. Make the fewest misses.

| Level  | Size  | What the player can do                                   | Beam                         |
| ------ | ----- | -------------------------------------------------------- | ---------------------------- |
| Easy   | 5 × 5 | Turn the mirrors.                                        | Shows at all times.          |
| Medium | 7 × 7 | Turn the mirrors. Put 1 or 2 mirrors from the tray.      | Shows when the player fires. |
| Hard   | 9 × 9 | Turn the mirrors and the laser. Put 1 or 2 tray mirrors. | Shows when the player fires. |

On medium and hard, the player plans the path and then fires the laser. A shot that does not hit the monster is a miss. To put a mirror from the tray, select an empty square. A tray mirror goes back to the tray after four turns.

## Puzzle data

Each row of `board` has one character for each square:

| Character | Piece                                                               |
| --------- | ------------------------------------------------------------------- |
| `.`       | Empty square                                                        |
| `#`       | Wall                                                                |
| `L`       | Laser. `laser` gives its direction.                                 |
| `M`       | Monster                                                             |
| `-`       | Horizontal mirror (0°)                                              |
| `/`       | Mirror from bottom left to top right (45°)                          |
| `\|`      | Vertical mirror (90°)                                               |
| `\`       | Mirror from top left to bottom right (135°). In JSON, write `"\\"`. |

The directions are `E`, `NE`, `N`, `NW`, `W`, `SW`, `S` and `SE`. `tray` is the number of mirrors in the tray.

The data checks make sure that the beam does not hit the monster at the start, that the puzzle has a solution, and that each solution needs all the mirrors in the tray.

## Example

```text
L  .  .  -  .
.  .  .  .  .
.  #  .  .  .
.  .  .  .  .
.  .  .  |  M
```

The laser is at row 1, column 1 and points right. The level is easy, so the beam shows at all times.

1. The beam goes right, along the horizontal mirror at row 1, column 4, and off the board.
2. The player selects the mirror at row 1, column 4. It turns to `\`. The beam now goes down, along the vertical mirror at row 5, column 4, and off the board.
3. The player selects the mirror at row 5, column 4. It turns to `/`. The beam goes left and off the board.
4. The player selects the same mirror again. It turns to `-`. The beam goes up, and the mirror at row 1, column 4 sends it back to the laser.
5. The player selects the same mirror again. It turns to `\`. The beam goes right and hits the monster. The puzzle is solved.

`examples/latics-0000.json` has this example as a puzzle file.
