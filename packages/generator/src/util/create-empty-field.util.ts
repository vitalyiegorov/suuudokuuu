import type { FieldInterface } from '../interfaces/field.interface';
import type { SudokuConfigInterface } from '../interfaces/sudoku-config.interface';

export const createEmptyField = (config: SudokuConfigInterface): FieldInterface =>
    Array.from({ length: config.fieldSize }, (_, y) =>
        Array.from({ length: config.fieldSize }, (__, x) => ({
            y,
            x,
            value: config.blankCellValue,
            group: Math.floor(x / config.fieldGroupWidth) * config.fieldGroupWidth + Math.floor(y / config.fieldGroupHeight) + 1
        }))
    );
