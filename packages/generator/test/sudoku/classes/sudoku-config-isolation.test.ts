import { afterEach, describe, expect, it } from 'vitest';

import { DifficultyEnum } from '../../../src/@generic/enums/difficulty.enum';
import { defaultSudokuConfig } from '../../../src/@generic/interfaces/sudoku-config.interface';
import { Sudoku } from '../../../src/sudoku/classes/sudoku';

const originalDifficulty = defaultSudokuConfig.difficulty;
const puzzle = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const easierPuzzle = '534678912672195348198342567859761423426853791713924856961537284287419635345286...';

afterEach(() => {
    defaultSudokuConfig.difficulty = originalDifficulty;
});

describe('Sudoku - Config Isolation', () => {
    it('preserves the default Newbie difficulty when parsing another difficulty', () => {
        Sudoku.fromString(puzzle);

        expect(defaultSudokuConfig.difficulty).toBe(DifficultyEnum.Newbie);
    });

    it('preserves an existing instance difficulty when another instance is parsed', () => {
        defaultSudokuConfig.difficulty = DifficultyEnum.Newbie;
        const existingSudoku = new Sudoku();

        Sudoku.fromString(puzzle);

        expect(existingSudoku.Difficulty).toBe(DifficultyEnum.Newbie);
    });

    it('keeps each parsed instance difficulty independent', () => {
        const harder = Sudoku.fromString(puzzle);
        const easier = Sudoku.fromString(easierPuzzle);

        expect(harder.Difficulty).not.toBe(easier.Difficulty);
        expect(easier.Difficulty).toBe(DifficultyEnum.Newbie);
        expect(defaultSudokuConfig.difficulty).toBe(DifficultyEnum.Newbie);
    });
});
