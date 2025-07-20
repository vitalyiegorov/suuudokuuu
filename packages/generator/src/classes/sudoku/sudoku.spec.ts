import { describe, expect, it } from '@jest/globals';

import { DifficultyEnum } from '../../enums/difficulty.enum';
import { defaultSudokuConfig, getBlankCellCountByConfig } from '../../interfaces/sudoku-config.interface';

import { Sudoku } from './sudoku';

import type { CellInterface } from '../../interfaces/cell.interface';

describe('Sudoku', () => {
    it.each(Object.values(DifficultyEnum))('puzzle creation with difficulty "%s"', difficulty => {
        const sudoku = new Sudoku();
        sudoku.create(difficulty);

        const blanks = sudoku.Field.flat().filter(cell => cell.value === defaultSudokuConfig.blankCellValue).length;

        expect(blanks).toBe(getBlankCellCountByConfig({ ...defaultSudokuConfig, difficulty }));
    });

    it('getCorrectValue() with no cell returns blankCellValue', () => {
        const sudoku = new Sudoku();

        expect(sudoku.getCorrectValue()).toBe(defaultSudokuConfig.blankCellValue);
    });

    it('create() finishes without throwing and produces correct number of blanks', () => {
        const sudoku = new Sudoku();
        sudoku.create(DifficultyEnum.Newbie);

        const blanks = sudoku.Field.flat().filter(cell => cell.value === defaultSudokuConfig.blankCellValue).length;

        expect(blanks).toBe(getBlankCellCountByConfig(defaultSudokuConfig));
    });

    it('getCorrectValue(cell) returns a number 1–fieldSize for a blank cell', () => {
        const sudoku = new Sudoku();
        sudoku.create(DifficultyEnum.Hard);

        const blankCell = sudoku.Field.flat().find(cell => cell.value === defaultSudokuConfig.blankCellValue);

        const correct = sudoku.getCorrectValue(blankCell);

        expect(correct).toBeGreaterThanOrEqual(1);
        expect(correct).toBeLessThanOrEqual(defaultSudokuConfig.fieldSize);
    });

    describe('cell-highlighting and comparison helpers', () => {
        const sudoku = new Sudoku();

        const base: CellInterface = { x: 1, y: 2, group: 5, value: 7 };

        it('isCellHighlighted → same row', () => {
            const sel = { x: 3, y: 2, group: 8, value: 0 };

            expect(sudoku.isCellHighlighted(base, sel)).toBe(true);
        });

        it('isCellHighlighted → same column', () => {
            const sel = { x: 1, y: 8, group: 2, value: 0 };

            expect(sudoku.isCellHighlighted(base, sel)).toBe(true);
        });

        it('isCellHighlighted → same group', () => {
            const sel = { x: 0, y: 0, group: 5, value: 0 };

            expect(sudoku.isCellHighlighted(base, sel)).toBe(true);
        });

        it('isSameCell()', () => {
            const sel = { x: 1, y: 2, group: 99, value: 0 };

            expect(sudoku.isSameCell(base, sel)).toBe(true);
            expect(sudoku.isSameCell(base, { x: 1, y: 3, group: 5, value: 7 })).toBe(false);
        });

        it('isSameCellValue()', () => {
            expect(sudoku.isSameCellValue(base, { ...base })).toBe(true);
            expect(sudoku.isSameCellValue({ ...base, value: 0 }, { ...base, value: 0 })).toBe(false);
        });
    });

    describe('group-boundary helpers', () => {
        it('isLastInCellGroupX()', () => {
            const sudoku = new Sudoku();

            expect(sudoku.isLastInCellGroupX({ x: 2, y: 0, group: 0, value: 0 })).toBe(true);
            expect(sudoku.isLastInCellGroupX({ x: 1, y: 0, group: 0, value: 0 })).toBe(false);
        });

        it('isLastInCellGroupY()', () => {
            const sudoku = new Sudoku();

            expect(sudoku.isLastInCellGroupY({ x: 0, y: 2, group: 0, value: 0 })).toBe(true);
            expect(sudoku.isLastInCellGroupY({ x: 0, y: 1, group: 0, value: 0 })).toBe(false);
        });
    });

    it('setCellValue() throws on wrong value', () => {
        const sudoku = new Sudoku();
        sudoku.create(DifficultyEnum.Easy);

        const badCell: CellInterface = { x: 0, y: 0, group: 0, value: 999 };

        expect(() => sudoku.setCellValue(badCell)).toThrow('Cell value is wrong');
    });
});
