import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { pickInfinityPuzzle } from '@suuudokuuu/hell-corpus';
import { createSeededRandom } from '@suuudokuuu/solver-core';

export interface InfinityGameInterface {
    readonly sudoku: Sudoku;
    readonly rating: number;
}

export const gameProviderCreateInfinityGame = (): InfinityGameInterface => {
    const { puzzle, rating } = pickInfinityPuzzle(createSeededRandom(Date.now()));

    return { sudoku: Sudoku.fromString(puzzle, defaultSudokuConfig), rating };
};
