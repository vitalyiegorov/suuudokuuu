/* eslint-disable max-lines */
import { describe, expect, it, jest } from '@jest/globals';

import { DifficultyEnum } from '../../enums/difficulty.enum';
import { defaultSudokuConfig, getBlankCellCountByConfig } from '../../interfaces/sudoku-config.interface';

import { Sudoku } from './sudoku';

import type { CellInterface } from '../../interfaces/cell.interface';

describe('Sudoku - Basic Operations', () => {
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
});

describe('Sudoku - Cell Highlighting and Comparison', () => {
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

describe('Sudoku - Group Boundary Helpers', () => {
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

describe('Sudoku - Row Column Boundary Helpers', () => {
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

// eslint-disable-next-line max-lines-per-function
describe('Sudoku - Cell Value Operations', () => {
    it('setCellValue() throws on wrong value', () => {
        const sudoku = new Sudoku();
        sudoku.create(DifficultyEnum.Easy);

        const badCell: CellInterface = { x: 0, y: 0, group: 0, value: 999 };

        expect(() => sudoku.setCellValue(badCell)).toThrow('Cell value is wrong');
    });

    it('should handle failure to create game field', () => {
        expect.assertions(1);

        const sudoku = new Sudoku();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-type-assertion
        jest.spyOn(sudoku as any, 'fillRecursive').mockImplementation(() => false);

        expect(() => void sudoku.create(DifficultyEnum.Easy)).toThrow('Unable to create a game field');
    });

    describe('Sudoku - Scoring (deterministic)', () => {
        it('complete a row', () => {
            const sudoku = Sudoku.fromString(
                '417352689852796134963148275241685397796234851538971426385467912629513748174829563|417352.898.27.613..6.14827..416.53..79623.8.15389.142638546.912..9.13...1748.9.6.'
            );

            // eslint-disable-next-line @typescript-eslint/prefer-destructuring
            const cell = sudoku.Field[0][6];
            const correct = sudoku.getCorrectValue(cell);
            const scored = sudoku.setCellValue({ ...cell, value: correct });

            expect(scored.x).toBe(-1);
            expect(scored.y).toBe(0);
            expect(scored.group).toBe(-1);
            expect(scored.isWon).toBe(false);
            expect(scored.values).toStrictEqual([]);
        });

        it('complete a column', () => {
            const sudoku = Sudoku.fromString(
                '417352689852796134963148275241685397796234851538971426385467912629513748174829563|417352.898.27.613..6.14827..416.53..79623.8.15389.142638546.912..9.13...1748.9.6.'
            );

            // eslint-disable-next-line @typescript-eslint/prefer-destructuring
            const cell = sudoku.Field[2][2];
            const correct = sudoku.getCorrectValue(cell);
            const scored = sudoku.setCellValue({ ...cell, value: correct });

            expect(scored.x).toBe(2);
            expect(scored.y).toBe(-1);
            expect(scored.group).toBe(-1);
            expect(scored.isWon).toBe(false);
            expect(scored.values).toStrictEqual([]);
        });

        it('complete a group', () => {
            const sudoku = Sudoku.fromString(
                '417352689852796134963148275241685397796234851538971426385467912629513748174829563|417352.898.27.613..6.14827..416.53..79623.8.15389.142638546.912..9.13...1748.9.6.'
            );

            // eslint-disable-next-line @typescript-eslint/prefer-destructuring
            const cell = sudoku.Field[3][0];
            const correct = sudoku.getCorrectValue(cell);
            const scored = sudoku.setCellValue({ ...cell, value: correct });

            expect(scored.x).toBe(-1);
            expect(scored.y).toBe(-1);
            expect(scored.group).toBe(2);
            expect(scored.isWon).toBe(false);
            expect(scored.values).toStrictEqual([]);
        });

        it('complete all values', () => {
            const sudoku = Sudoku.fromString(
                '417352689852796134963148275241685397796234851538971426385467912629513748174829563|417352.898.27.613..6.14827.2416.53..79623.8.15389.142638546.912.29.13...1748.9.6.'
            );

            // eslint-disable-next-line @typescript-eslint/prefer-destructuring
            const cell = sudoku.Field[8][4];
            const correct = sudoku.getCorrectValue(cell);
            const scored = sudoku.setCellValue({ ...cell, value: correct });

            expect(scored.x).toBe(-1);
            expect(scored.y).toBe(-1);
            expect(scored.group).toBe(-1);
            expect(scored.isWon).toBe(false);
            expect(scored.values).toStrictEqual([2]);
        });

        it('complete whole game', () => {
            const sudoku = Sudoku.fromString(
                '417352689852796134963148275241685397796234851538971426385467912629513748174829563|41735268985279613496314827524168539779623485153897142638546791262951374.174829563'
            );

            // eslint-disable-next-line @typescript-eslint/prefer-destructuring
            const cell = sudoku.Field[7][8];
            const correct = sudoku.getCorrectValue(cell);
            const scored = sudoku.setCellValue({ ...cell, value: correct });

            expect(scored.x).toBe(8);
            expect(scored.y).toBe(7);
            expect(scored.group).toBe(9);
            expect(scored.isWon).toBe(true);
            expect(scored.values).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });
    });

    it('should handle game winning scenario', () => {
        const sudoku = new Sudoku();
        sudoku.create(DifficultyEnum.Newbie);

        while (sudoku.PossibleValues.length > 0) {
            const blankCell = sudoku.Field.flat().find(cell => cell.value === defaultSudokuConfig.blankCellValue);

            expect(blankCell).toBeDefined();

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const correctValue = sudoku.getCorrectValue(blankCell);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const cellToSet = { ...blankCell!, value: correctValue };
            sudoku.setCellValue(cellToSet);
        }

        expect(sudoku.PossibleValues).toHaveLength(0);
        expect(sudoku.Field.flat().every(cell => cell.value !== defaultSudokuConfig.blankCellValue)).toBe(true);
    });

    it('should handle value completion scoring', () => {
        const sudoku = new Sudoku();
        sudoku.create(DifficultyEnum.Easy);

        const blankCell = sudoku.Field.flat().find(cell => cell.value === defaultSudokuConfig.blankCellValue);

        expect(blankCell).toBeDefined();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const correctValue = sudoku.getCorrectValue(blankCell);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const cellToSet = { ...blankCell!, value: correctValue };
        const scoredCells = sudoku.setCellValue(cellToSet);

        expect(scoredCells.values).toBeDefined();
    });
});

describe('Sudoku - Static Methods', () => {
    it('fromString should return Sudoku instance', () => {
        expect.assertions(1);

        const testFieldsString =
            '875469123469123875123875469784596231596231784231784596658947312947312658312658947|...469123469123875123875469784596...596231784231784596658947312947312658312658...';

        const sudoku = Sudoku.fromString(testFieldsString, defaultSudokuConfig);

        expect(sudoku).toBeInstanceOf(Sudoku);
    });
});

describe('Sudoku - Candidates', () => {
    it('getCellCandidates should return single possible cell value', () => {
        const sudoku = Sudoku.fromString(
            '271345968384619752659872314537986241126437895498251673963124587845793126712568439|27.3459.838.6..75..598.2..45.7986.4.1264378.5498...673.6312.5.784.793.267125.84.9'
        );

        // eslint-disable-next-line @typescript-eslint/prefer-destructuring
        const cell = sudoku.Field[2][0];
        const candidates = sudoku.getCellCandidates(cell);

        expect(candidates).toStrictEqual([6]);
    });

    it('getCellCandidates should return multiple possible cell values', () => {
        const sudoku = Sudoku.fromString(
            '271345968384619752659872314537986241126437895498251673963124587845793126712568439|27.3459.838.6..75..598.2..45.7986.4.1264378.5498...673.6312.5.784.793.267125.84.9'
        );

        // eslint-disable-next-line @typescript-eslint/prefer-destructuring
        const cell = sudoku.Field[5][4];
        const candidates = sudoku.getCellCandidates(cell);

        expect(candidates).toStrictEqual([1, 5]);
    });
});
/* eslint-enable max-lines */
