import { describe, expect, it } from '@jest/globals';
import { GRID_SIZE } from '@suuudokuuu/solver-core';

import { SerializableSudoku } from '../../serializable-sudoku/classes/serializable-sudoku';
import { defaultSudokuConfig } from '../interfaces/sudoku-config.interface';

import { fieldToGrid } from './field-to-grid.util';

describe('fieldToGrid', () => {
    it('maps a field to a flat row-major grid, preserving blanks and given values', () => {
        const testFieldsString = '...469123469123875123875469784596...596231784231784596658947312947312658312658...';
        const sudoku = SerializableSudoku.fromString(testFieldsString, defaultSudokuConfig);

        const grid = fieldToGrid(sudoku.Field);

        expect(grid[0 * GRID_SIZE + 0]).toBe(defaultSudokuConfig.blankCellValue);
        expect(grid[0 * GRID_SIZE + 3]).toBe(4);
    });
});
