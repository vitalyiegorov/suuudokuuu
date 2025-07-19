import { describe, expect, it } from '@jest/globals';

import { DifficultyEnum } from '../../../@generic/enums/difficulty.enum';
import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';

import { Sudoku } from './sudoku';

// TODO: Cover whole logic with tests
describe('sudoku', () => {
    it('create field', () => {
        // Expect.assertions()
        const sudoku = new Sudoku(defaultSudokuConfig);

        sudoku.create(DifficultyEnum.Newbie);

        expect(sudoku.Field).toHaveLength(defaultSudokuConfig.fieldSize);
    });
});
