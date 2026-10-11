# Guzzle

## Rules

Four words cross at the center letter: across, down and two diagonals. All words have the same length. Put a letter in a square. Green: the letter is correct. Yellow: this line has the letter in a different square. Red: this line does not have the letter. Make all squares green with the fewest mistakes.

## Example

```text
R  B  P
C  A  T
M  G  N
```

Answer: CAT across, BAG down, RAN on the diagonal from the top left, MAP on the diagonal from the bottom left. All diagonals read from left to right.

1. The board shows only the center letter A. The player selects "With bank". The bank shows B C G M N P R T.
2. The player puts T in the top-left square. That square is on the diagonal RAN. RAN has no T, so the square shows red ✗. Mistakes: 1.
3. The player puts N in the top-left square. RAN has N in a different square, so the square shows yellow ↔. Mistakes: 2.
4. The player puts N in the bottom-right square. The square shows green ✓. The N stays there.
5. The player continues until all 8 squares are green. The result is "With bank, 2 mistakes".
