# Colour Binary

## Rules

Make each square red or blue. Each row and each column has the same number of red squares and blue squares. Three squares of the same colour must not be next to each other in a row or a column.

## Example

```text
Start      Answer
. . B .    R B B R
. R . .    B R R B
R R . .    R R B B
. . . .    B B R R
```

R is red, B is blue and . is an empty square.

1. Row 3 has two red squares. Thus its two empty squares are blue.
2. Column 2 has two red squares. Thus its top square and its bottom square are blue.
3. Row 1 has two blue squares. Thus its two empty squares are red.
4. Column 1 has two red squares. Thus its two empty squares are blue.
5. Row 4 has two blue squares. Thus its two empty squares are red.
6. Column 3 has two blue squares. Thus its empty square is red. The last square of row 2 is blue.

`examples/colour-binary-0000.json` has this example as a puzzle file.
