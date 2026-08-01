import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { pickHellPuzzle } from '@suuudokuuu/hell-corpus';
import { createSeededRandom } from '@suuudokuuu/solver-core';

export const gameProviderCreateHellGame = (): Sudoku => {
    const puzzle = pickHellPuzzle(createSeededRandom(Date.now()));

    return Sudoku.fromString(puzzle, defaultSudokuConfig);
};
