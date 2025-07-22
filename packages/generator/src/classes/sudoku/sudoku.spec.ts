import { describe, expect, it, jest } from '@jest/globals';

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

    describe('row-column boundary helpers', () => {
        it('isLastInRow()', () => {
            const sudoku = new Sudoku();

            expect(sudoku.isLastInRow({ x: 0, y: 8, group: 0, value: 0 })).toBe(true);
            expect(sudoku.isLastInRow({ x: 0, y: 7, group: 0, value: 0 })).toBe(false);
            expect(sudoku.isLastInRow({ x: 8, y: 8, group: 0, value: 0 })).toBe(true);
        });

        it('isLastInColumn()', () => {
            const sudoku = new Sudoku();

            expect(sudoku.isLastInColumn({ x: 8, y: 0, group: 0, value: 0 })).toBe(true);
            expect(sudoku.isLastInColumn({ x: 7, y: 0, group: 0, value: 0 })).toBe(false);
            expect(sudoku.isLastInColumn({ x: 8, y: 8, group: 0, value: 0 })).toBe(true);
        });
    });

    it('setCellValue() throws on wrong value', () => {
        const sudoku = new Sudoku();
        sudoku.create(DifficultyEnum.Easy);

        const badCell: CellInterface = { x: 0, y: 0, group: 0, value: 999 };

        expect(() => sudoku.setCellValue(badCell)).toThrow('Cell value is wrong');
    });

    it('should handle failure to create game field', () => {
        expect.assertions(1);

        const sudoku = new Sudoku();
        
        jest.spyOn(sudoku, 'fillRecursive').mockImplementation().mockReturnValue(false);

        expect(() => void sudoku.create(DifficultyEnum.Easy)).toThrow('Unable to create a game field');
    });

    it('should return scored cells when setting correct cell value', () => {
        const sudoku = new Sudoku();
        sudoku.create(DifficultyEnum.Easy);

        const blankCell = sudoku.Field.flat().find(cell => cell.value === defaultSudokuConfig.blankCellValue);
        expect(blankCell).toBeDefined();
        
        if (blankCell) {
            const correctValue = sudoku.getCorrectValue(blankCell);
            const cellToSet = { ...blankCell, value: correctValue };
            const scoredCells = sudoku.setCellValue(cellToSet);
            expect(scoredCells).toBeDefined();
        }
    });

    it('should handle column, row, and group completion scoring', () => {
        const sudoku = new Sudoku();
        sudoku.create(DifficultyEnum.Easy);

        const blankCell = sudoku.Field.flat().find(cell => cell.value === defaultSudokuConfig.blankCellValue);
        expect(blankCell).toBeDefined();
        
        if (blankCell) {
            const correctValue = sudoku.getCorrectValue(blankCell);
            const cellToSet = { ...blankCell, value: correctValue };
            const scoredCells = sudoku.setCellValue(cellToSet);
            expect(scoredCells).toBeDefined();
        }
    });

    it('should handle game winning scenario', () => {
        const sudoku = new Sudoku();
        sudoku.create(DifficultyEnum.Newbie);

        let moveCount = 0;
        const maxMoves = 100;
        
        while (sudoku.possibleValues.length > 0 && moveCount < maxMoves) {
            const blankCell = sudoku.Field.flat().find(cell => cell.value === defaultSudokuConfig.blankCellValue);
            if (blankCell) {
                const correctValue = sudoku.getCorrectValue(blankCell);
                const cellToSet = { ...blankCell, value: correctValue };
                sudoku.setCellValue(cellToSet);
            }
            moveCount += 1;
        }

        expect(moveCount).toBeLessThan(maxMoves);
    });

    it('should handle value completion scoring', () => {
        const sudoku = new Sudoku();
        sudoku.create(DifficultyEnum.Easy);

        const blankCell = sudoku.Field.flat().find(cell => cell.value === defaultSudokuConfig.blankCellValue);
        expect(blankCell).toBeDefined();
        
        if (blankCell) {
            const correctValue = sudoku.getCorrectValue(blankCell);
            const cellToSet = { ...blankCell, value: correctValue };
            const scoredCells = sudoku.setCellValue(cellToSet);
            expect(scoredCells.values).toBeDefined();
        }
    });

    it('fromString should return Sudoku instance', () => {
        expect.assertions(1);

        const testFieldsString =
            '875469123469123875123875469784596231596231784231784596658947312947312658312658947|...469123469123875123875469784596...596231784231784596658947312947312658312658...';

        const sudoku = Sudoku.fromString(testFieldsString, defaultSudokuConfig);

        expect(sudoku).toBeInstanceOf(Sudoku);
    });
});

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
            const cellA = { x: 0, y: 0, group: 0, value: 0 };
            const cellB = { x: 1, y: 0, group: 0, value: 0 };
            const correctValueA = sudoku.getCorrectValue(cellA);
            const correctValueB = sudoku.getCorrectValue(cellB);

            expect(sudoku.isCorrectValue({ ...cellA, value: correctValueA })).toBe(true);
            expect(sudoku.isCorrectValue({ ...cellA, value: correctValueB })).toBe(false);
            expect(sudoku.isCorrectValue()).toBe(false);
        });

        it('isCellWrong() validation with correct value', () => {
            const sudoku = new Sudoku();
            sudoku.create(DifficultyEnum.Easy);
            const testCell = { x: 0, y: 0, group: 0, value: 0 };
            const correctValue = sudoku.getCorrectValue(testCell);
            const correctCell = { ...testCell, value: correctValue };

            expect(sudoku.isCellWrong(correctCell, correctCell)).toBe(false);
        });
    });
});

describe('Sudoku - Scoring', () => {
    describe('scoring helpers', () => {
        const emptyScoredCells = { x: -1, y: -1, group: -1, values: [], isWon: false };

        it('isScoredCell() returns true when game is won', () => {
            const sudoku = new Sudoku();
            const cell = { x: 0, y: 0, group: 0, value: 5 };
            const scoredCells = { ...emptyScoredCells, isWon: true };

            expect(sudoku.isScoredCell(cell, scoredCells)).toBe(true);
        });

        it('isScoredCell() returns true for matching coordinates', () => {
            const sudoku = new Sudoku();
            const cell = { x: 3, y: 4, group: 2, value: 7 };

            expect(sudoku.isScoredCell(cell, { ...emptyScoredCells, x: 3 })).toBe(true);
            expect(sudoku.isScoredCell(cell, { ...emptyScoredCells, y: 4 })).toBe(true);
            expect(sudoku.isScoredCell(cell, { ...emptyScoredCells, group: 2 })).toBe(true);
            expect(sudoku.isScoredCell(cell, { ...emptyScoredCells, values: [7] })).toBe(true);
        });

        it('isScoredCell() returns false when no conditions match', () => {
            const sudoku = new Sudoku();
            const cell = { x: 0, y: 0, group: 0, value: 5 };
            const scoredCells = { ...emptyScoredCells, x: 1, y: 1, group: 1, values: [6, 7, 8] };

            expect(sudoku.isScoredCell(cell, scoredCells)).toBe(false);
        });

        it('getScore() returns a number', () => {
            const sudoku = new Sudoku();
            const scoredCells = { ...emptyScoredCells };

            const score = sudoku.getScore(scoredCells, 100, 2);

            expect(typeof score).toBe('number');
            expect(score).toBeGreaterThanOrEqual(0);
        });
    });
});
