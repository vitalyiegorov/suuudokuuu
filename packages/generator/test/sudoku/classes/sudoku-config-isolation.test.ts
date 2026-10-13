import { afterEach, describe, expect, it } from 'vitest';

import { DifficultyEnum } from '../../../src/@generic/enums/difficulty.enum';
import { defaultSudokuConfig } from '../../../src/@generic/interfaces/sudoku-config.interface';
import { Sudoku } from '../../../src/sudoku/classes/sudoku';

const originalDifficulty = defaultSudokuConfig.difficulty;
const puzzle = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

afterEach(() => {
    defaultSudokuConfig.difficulty = originalDifficulty;
});

describe('Sudoku - Config Isolation', () => {
    it.fails('preserves the default Newbie difficulty when parsing another difficulty', () => {
        Sudoku.fromString(puzzle);

        expect(defaultSudokuConfig.difficulty).toBe(DifficultyEnum.Newbie);
    });

    it.fails('preserves an existing instance difficulty when another instance is parsed', () => {
        defaultSudokuConfig.difficulty = DifficultyEnum.Newbie;
        const existingSudoku = new Sudoku();

        Sudoku.fromString(puzzle);

        expect(existingSudoku.Difficulty).toBe(DifficultyEnum.Newbie);
    });
});
