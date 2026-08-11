import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { pickInfinityPuzzle } from '@suuudokuuu/hell-corpus';
import { createSeededRandom } from '@suuudokuuu/solver-core';

import type { RatedGameInterface } from '../interface/rated-game.interface';

export const gameProviderCreateInfinityGame = (): RatedGameInterface => {
    const { puzzle, rating } = pickInfinityPuzzle(createSeededRandom(Date.now()));

    return { sudoku: Sudoku.fromString(puzzle, defaultSudokuConfig), rating };
};
