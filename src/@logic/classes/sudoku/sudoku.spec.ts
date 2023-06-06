import { describe, expect, it } from '@jest/globals';

import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';

import { Sudoku } from './sudoku';

// TODO: Cover whole logic with tests
describe('Sudoku', () => {
    it('create field', () => {
        // Expect.assertions()
        const sudoku = new Sudoku(defaultSudokuConfig);

        const fullField = sudoku.createFullField();

        expect(fullField).toHaveLength(defaultSudokuConfig.fieldSize);
    });
});
