import { describe, expect, it } from '@jest/globals';

import { isDefined } from '@rnw-community/shared';

import { DifficultyEnum } from '../../enums/difficulty.enum';
import { emptyScoredCells } from '../../interfaces/scored-cells.interface';
import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';

import { Sudoku } from './sudoku';

describe('Sudoku - Additional Cell Methods', () => {
    describe('cell navigation helpers', () => {
        it('getCellRight() navigation', () => {
            const sudoku = new Sudoku();
            sudoku.create(DifficultyEnum.Easy);

            expect(sudoku.getCellRight({ x: 3, y: 4, group: 0, value: 5 })).toStrictEqual({
                x: 4,
                y: 4,
                group: expect.any(Number),
                value: expect.any(Number)
            });
            expect(sudoku.getCellRight({ x: 8, y: 4, group: 0, value: 5 })).toStrictEqual({ x: 8, y: 4, group: 0, value: 5 });
            expect(sudoku.getCellRight()).toBeUndefined();
        });

        it('getCellLeft() navigation', () => {
            const sudoku = new Sudoku();
            sudoku.create(DifficultyEnum.Easy);

            expect(sudoku.getCellLeft({ x: 3, y: 4, group: 0, value: 5 })).toStrictEqual({
                x: 2,
                y: 4,
                group: expect.any(Number),
                value: expect.any(Number)
            });
            expect(sudoku.getCellLeft({ x: 0, y: 4, group: 0, value: 5 })).toStrictEqual({ x: 0, y: 4, group: 0, value: 5 });
        });

        it('getCellUp() navigation', () => {
            const sudoku = new Sudoku();
            sudoku.create(DifficultyEnum.Easy);

            expect(sudoku.getCellUp({ x: 3, y: 4, group: 0, value: 5 })).toStrictEqual({
                x: 3,
                y: 3,
                group: expect.any(Number),
                value: expect.any(Number)
            });
            expect(sudoku.getCellUp({ x: 3, y: 0, group: 0, value: 5 })).toStrictEqual({ x: 3, y: 0, group: 0, value: 5 });
        });

        it('getCellDown() navigation', () => {
            const sudoku = new Sudoku();
            sudoku.create(DifficultyEnum.Easy);

            expect(sudoku.getCellDown({ x: 3, y: 4, group: 0, value: 5 })).toStrictEqual({
                x: 3,
                y: 5,
                group: expect.any(Number),
                value: expect.any(Number)
            });
            expect(sudoku.getCellDown({ x: 3, y: 8, group: 0, value: 5 })).toStrictEqual({ x: 3, y: 8, group: 0, value: 5 });
        });
    });
});

describe('Sudoku - Cell Validation', () => {
    describe('cell validation helpers', () => {
        it('isBlankCell() validation', () => {
            const sudoku = new Sudoku();
            sudoku.create(DifficultyEnum.Easy);
            const blankCell = sudoku.Field.flat().find(cell => cell.value === defaultSudokuConfig.blankCellValue);
            const nonBlankCell = sudoku.Field.flat().find(cell => cell.value !== defaultSudokuConfig.blankCellValue);

            expect(sudoku.isBlankCell(blankCell)).toBe(true);
            expect(sudoku.isBlankCell(nonBlankCell)).toBe(false);
            expect(sudoku.isBlankCell()).toBe(false);
        });

        it('isCorrectValue() validation', () => {
            const sudoku = new Sudoku();
            sudoku.create(DifficultyEnum.Easy);
            
            const blankCell = sudoku.Field.flat().find(cell => cell.value === defaultSudokuConfig.blankCellValue);
            const nonBlankCell = sudoku.Field.flat().find(cell => cell.value !== defaultSudokuConfig.blankCellValue);

            expect(sudoku.isCorrectValue(nonBlankCell)).toBe(true);
            expect(sudoku.isCorrectValue(blankCell)).toBe(false);
            expect(sudoku.isCorrectValue(undefined)).toBe(false);
        });

        it('isCellWrong() validation with correct value', () => {
            const sudoku = new Sudoku();
            sudoku.create(DifficultyEnum.Easy);
            
            const filledCell = sudoku.Field.flat().find(cell => cell.value !== defaultSudokuConfig.blankCellValue);
            const differentCell = { x: 1, y: 1, group: 1, value: 8 };

            expect(isDefined(filledCell)).toBe(true);
            
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expect(sudoku.isCellWrong(filledCell!, differentCell)).toBe(false);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expect(sudoku.isCellWrong(filledCell!, filledCell)).toBe(false);
        });
    });
});

describe('Sudoku - Scoring', () => {
    describe('scoring helpers', () => {
        it('isScoredCell() returns true when game is won', () => {
            const sudoku = new Sudoku();
            sudoku.create(DifficultyEnum.Newbie);

            const wonScoredCells = { ...emptyScoredCells, isWon: true };

            expect(sudoku.isScoredCell({ x: 0, y: 0, group: 0, value: 1 }, wonScoredCells)).toBe(true);
        });

        it('isScoredCell() returns true for matching coordinates', () => {
            const sudoku = new Sudoku();
            const scoredCells = { ...emptyScoredCells, x: 2, y: 3 };

            expect(sudoku.isScoredCell({ x: 2, y: 3, group: 0, value: 1 }, scoredCells)).toBe(true);
        });

        it('isScoredCell() returns false when no conditions match', () => {
            const sudoku = new Sudoku();
            const scoredCells = { ...emptyScoredCells, x: 2, y: 3 };

            expect(sudoku.isScoredCell({ x: 1, y: 1, group: 0, value: 1 }, scoredCells)).toBe(false);
        });

        it('getScore() returns a number', () => {
            const sudoku = new Sudoku();

            const score = sudoku.getScore(emptyScoredCells, 100, 2);

            expect(typeof score).toBe('number');
        });
    });
});