import { GRID_BLANK_VALUE, GRID_SIZE } from '@suuudokuuu/solver-core';
import { describe, expect, it } from 'vitest';

import { defaultSudokuConfig } from '../../../src/@generic/interfaces/sudoku-config.interface';
import { createEmptyField } from '../../../src/@generic/utils/create-empty-field.util';
import { fieldToGrid } from '../../../src/@generic/utils/field-to-grid.util';
import { SerializableSudoku } from '../../../src/serializable-sudoku/classes/serializable-sudoku';

describe('fieldToGrid', () => {
    it('normalizes a configured blank marker to the solver blank value', () => {
        const field = createEmptyField({ ...defaultSudokuConfig, blankCellValue: -1 });
        field[0][1].value = 4;
        expect(fieldToGrid(field, -1)[0]).toBe(GRID_BLANK_VALUE);
        expect(fieldToGrid(field, -1)[1]).toBe(4);
    });

    it('maps a field to a flat row-major grid, preserving blanks and given values', () => {
        const testFieldsString = '...469123469123875123875469784596...596231784231784596658947312947312658312658...';
        const sudoku = SerializableSudoku.fromString(testFieldsString, defaultSudokuConfig);

        const grid = fieldToGrid(sudoku.Field);

        expect(grid[0 * GRID_SIZE + 0]).toBe(defaultSudokuConfig.blankCellValue);
        expect(grid[0 * GRID_SIZE + 3]).toBe(4);
    });
});
