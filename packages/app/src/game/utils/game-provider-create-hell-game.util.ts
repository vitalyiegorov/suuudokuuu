import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { pickHellPuzzleRecord } from '@suuudokuuu/hell-corpus';
import { createSeededRandom } from '@suuudokuuu/solver-core';

import type { RatedGameInterface } from '../interface/rated-game.interface';

export const gameProviderCreateHellGame = (): RatedGameInterface => {
    const { puzzle, rating } = pickHellPuzzleRecord(createSeededRandom(Date.now()));

    return { sudoku: Sudoku.fromString(puzzle, defaultSudokuConfig), rating };
};
