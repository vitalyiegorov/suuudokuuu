import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { createSeededRandom, UNIQUENESS_COUNT_LIMIT } from '@suuudokuuu/solver-core';
import { describe, expect, it } from 'vitest';

import { DifficultyEnum } from '../../../src/@generic/enums/difficulty.enum';
import { defaultSudokuConfig } from '../../../src/@generic/interfaces/sudoku-config.interface';
import { fieldToGrid } from '../../../src/@generic/utils/field-to-grid.util';
import { Sudoku } from '../../../src/sudoku/classes/sudoku';

const seed = 20260823;

describe('Sudoku - Generated Puzzle Uniqueness', () => {
    it.each([DifficultyEnum.Newbie, DifficultyEnum.Easy, DifficultyEnum.Medium, DifficultyEnum.Hard, DifficultyEnum.Nightmare])(
        'generates exactly one solution for %s with a fixed seed',
        difficulty => {
            const sudoku = new Sudoku({ ...defaultSudokuConfig, random: createSeededRandom(seed) });

            sudoku.create(difficulty);

            expect(new BitmaskSolver().countSolutions(fieldToGrid(sudoku.Field), UNIQUENESS_COUNT_LIMIT)).toBe(1);
        }
    );
});
