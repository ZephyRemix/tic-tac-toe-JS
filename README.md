# Tic Tac Toe

A basic web interactive tic tac toe game.

[Live demo] -> https://zephyremix.github.io/tic-tac-toe-JS/

## Functionality

- Users can click the grid in the web interactive browser and their marker will be dropped appropriately on the cell.
- Game ends when either a streak is found, or when no more moves are available.

## Reflection
- After learning the difference between let, const, and var, I was really able to leverage my newfound-understanding of block vs functional scopes and tailor my approach to methods accordingly.
- The benefits of closure is quite apparent in its ability to encapsulate most of my methods, leaving only key methods (getter, setter, and playGame methods) public.
- Faced some challenges with the nature of IIFE that initializes the class objects upfront. Had to re-order classes' sequences in the codebase in order to make it work as intended.
- Potential upgrades were considered, but not implemented due to time constraints: button that pops up to reset the board when game is won or out of moves.