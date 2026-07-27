import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig, emptyScoredCells } from '@suuudokuuu/generator';

import { gameGetCellKeysToAnimate } from './game-get-cell-keys-to-animate.util';

const givens = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

describe('gameGetCellKeysToAnimate', () => {
    it('should collect the keys of a scored row', () => {
        expect.assertions(2);

        const sudoku = Sudoku.fromString(givens, defaultSudokuConfig);
        const keys = gameGetCellKeysToAnimate(sudoku, { ...emptyScoredCells, y: 0 });

        expect(keys.size).toBe(defaultSudokuConfig.fieldSize);
        expect(keys.has('0-0')).toBe(true);
    });

    it('should collect the whole board when the game is won', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromString(givens, defaultSudokuConfig);
        const keys = gameGetCellKeysToAnimate(sudoku, { ...emptyScoredCells, isWon: true });

        expect(keys.size).toBe(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize);
    });

    it('should collect nothing when no area scored', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromString(givens, defaultSudokuConfig);

        expect(gameGetCellKeysToAnimate(sudoku, emptyScoredCells).size).toBe(0);
    });
});
