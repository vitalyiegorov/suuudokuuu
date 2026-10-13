import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { createSeededRandom } from '@suuudokuuu/solver-core';
import { describe, expect, it, vi } from 'vitest';

import { DifficultyEnum } from '../../../src/@generic/enums/difficulty.enum';
import { emptyScoredCells } from '../../../src/@generic/interfaces/scored-cells.interface';
import { defaultSudokuConfig, getBlankCellCountByConfig } from '../../../src/@generic/interfaces/sudoku-config.interface';
import { Sudoku } from '../../../src/sudoku/classes/sudoku';

import type { CellInterface } from '../../../src/@generic/interfaces/cell.interface';

class ExtendedSudoku extends Sudoku {
    get marker(): string {
        return 'extended';
    }
}

const difficultiesReachableByRandomDigging = Object.values(DifficultyEnum).filter(
    difficulty => difficulty !== DifficultyEnum.Hell && difficulty !== DifficultyEnum.Infinity
);

describe('Sudoku - Basic Operations', () => {
    const testFieldsString = '...469123469123875123875469784596...596231784231784596658947312947312658312658...';

    it('preserves subclass factories', () => {
        expect.assertions(2);

        const sudoku = ExtendedSudoku.fromString(testFieldsString);

        expect(sudoku).toBeInstanceOf(ExtendedSudoku);
        expect(sudoku.marker).toBe('extended');
    });

    it('does not expose mutable configuration', () => {
        expect.assertions(1);

        const config = { ...defaultSudokuConfig, difficultyBlankCells: { ...defaultSudokuConfig.difficultyBlankCells } };
        const sudoku = new Sudoku(config);
        const exposedConfig = sudoku.Config;

        exposedConfig.blankCellValue = 9;

        expect(sudoku.Config.blankCellValue).toBe(config.blankCellValue);
    });

    it('narrows blank cells', () => {
        expect.assertions(1);

        const sudoku = ExtendedSudoku.fromString(testFieldsString);
        const cells: Array<CellInterface | undefined> = [sudoku.Field[0][0], undefined];
        const blankCells: CellInterface[] = cells.filter(cell => sudoku.isBlankCell(cell));

        expect(blankCells).toEqual([sudoku.Field[0][0]]);
    });

    it.each(difficultiesReachableByRandomDigging)('puzzle creation with difficulty "%s"', difficulty => {
        const sudoku = new Sudoku();
        sudoku.create(difficulty);

        const blanks = sudoku.Field.flat().filter(cell => cell.value === defaultSudokuConfig.blankCellValue).length;

        expect(blanks).toBe(getBlankCellCountByConfig({ ...defaultSudokuConfig, difficulty }));
    });

    it('keeps the best field when later uniqueness attempts reject more removals', () => {
        const unreachableBlankCells = defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize;
        const firstFieldChecks = 50 * unreachableBlankCells;
        const firstFieldBlankLimit = 60;
        const laterFieldBlankLimit = 50;
        let solutionChecks = 0;
        const countSolutionsSpy = vi.spyOn(BitmaskSolver.prototype, 'countSolutions').mockImplementation(grid => {
            solutionChecks += 1;
            const blankLimit = solutionChecks <= firstFieldChecks ? firstFieldBlankLimit : laterFieldBlankLimit;

            return [...grid].filter(value => value === 0).length <= blankLimit ? 1 : 2;
        });
        const sudoku = new Sudoku({
            ...defaultSudokuConfig,
            random: createSeededRandom(1),
            difficultyBlankCells: { ...defaultSudokuConfig.difficultyBlankCells, [DifficultyEnum.Newbie]: unreachableBlankCells }
        });
        sudoku.create(DifficultyEnum.Newbie);
        countSolutionsSpy.mockRestore();
        const blanks = sudoku.Field.flat().filter(cell => cell.value === defaultSudokuConfig.blankCellValue).length;

        expect(blanks).toBe(firstFieldBlankLimit);
        expect(sudoku.Field.flat().filter(cell => cell.value !== defaultSudokuConfig.blankCellValue)).toEqual(
            sudoku.FullField.flat().filter(cell => sudoku.Field[cell.y][cell.x].value !== defaultSudokuConfig.blankCellValue)
        );
    });

    it('generates a unique puzzle using a nonzero blank marker', () => {
        const blankCellValue = -1;
        const sudoku = new Sudoku({ ...defaultSudokuConfig, blankCellValue, random: createSeededRandom(1) });
        sudoku.create(DifficultyEnum.Newbie);
        const grid = Uint8Array.from(sudoku.Field.flat(), cell => (cell.value === blankCellValue ? 0 : cell.value));

        expect(sudoku.Field.flat().filter(cell => cell.value === blankCellValue)).toHaveLength(10);
        expect(new BitmaskSolver().countSolutions(grid, 2)).toBe(1);
    });

    it('getCorrectValue() with no cell returns blankCellValue', () => {
        const sudoku = new Sudoku();

        expect(sudoku.getCorrectValue()).toBe(defaultSudokuConfig.blankCellValue);
    });

    it('getCorrectValue(cell) returns a number 1–fieldSize for a blank cell', () => {
        const sudoku = Sudoku.fromString(testFieldsString);

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

describe('Sudoku - Cell Value Operations', () => {
    it('setCellValue() throws on wrong value', () => {
        const sudoku = new Sudoku();
        sudoku.create(DifficultyEnum.Easy);

        const badCell: CellInterface = { x: 0, y: 0, group: 0, value: 999 };

        expect(() => sudoku.setCellValue(badCell)).toThrow('Cell value is wrong');
    });

    describe('Sudoku - Scoring (deterministic)', () => {
        it('returns scoring arrays detached from future candidate calculations', () => {
            const sudoku = Sudoku.fromString('41735268985279613496314827524168539779623485153897142638546791262951374.174829563');
            const {
                7: { 8: cell }
            } = sudoku.Field;
            const scored = sudoku.setCellValue({ ...cell, value: sudoku.getCorrectValue(cell) });
            expect(scored.values).not.toBe(emptyScoredCells.values);
            const repeated = sudoku.setCellValue({ ...cell, value: sudoku.getCorrectValue(cell) });
            expect(scored.values).not.toBe(repeated.values);
        });

        it('does not share empty scoring values between results', () => {
            const sudoku = Sudoku.fromString('417352.898.27.613..6.14827..416.53..79623.8.15389.142638546.912..9.13...1748.9.6.');
            const {
                0: { 6: cell }
            } = sudoku.Field;
            const first = sudoku.setCellValue({ ...cell, value: sudoku.getCorrectValue(cell) });
            const second = sudoku.setCellValue({ ...cell, value: sudoku.getCorrectValue(cell) });
            expect(first.values).not.toBe(second.values);
            expect(first.values).not.toBe(emptyScoredCells.values);
        });

        it('complete a row', () => {
            const sudoku = Sudoku.fromString('417352.898.27.613..6.14827..416.53..79623.8.15389.142638546.912..9.13...1748.9.6.');

            const {
                0: { 6: cell }
            } = sudoku.Field;
            const correct = sudoku.getCorrectValue(cell);
            const scored = sudoku.setCellValue({ ...cell, value: correct });

            expect(scored.x).toBe(-1);
            expect(scored.y).toBe(0);
            expect(scored.group).toBe(-1);
            expect(scored.isWon).toBe(false);
            expect(scored.values).toStrictEqual([]);
        });

        it('complete a column', () => {
            const sudoku = Sudoku.fromString('417352.898.27.613..6.14827..416.53..79623.8.15389.142638546.912..9.13...1748.9.6.');

            const {
                2: { 2: cell }
            } = sudoku.Field;
            const correct = sudoku.getCorrectValue(cell);
            const scored = sudoku.setCellValue({ ...cell, value: correct });

            expect(scored.x).toBe(2);
            expect(scored.y).toBe(-1);
            expect(scored.group).toBe(-1);
            expect(scored.isWon).toBe(false);
            expect(scored.values).toStrictEqual([]);
        });

        it('complete a group', () => {
            const sudoku = Sudoku.fromString('417352.898.27.613..6.14827..416.53..79623.8.15389.142638546.912..9.13...1748.9.6.');

            const {
                3: { 0: cell }
            } = sudoku.Field;
            const correct = sudoku.getCorrectValue(cell);
            const scored = sudoku.setCellValue({ ...cell, value: correct });

            expect(scored.x).toBe(-1);
            expect(scored.y).toBe(-1);
            expect(scored.group).toBe(2);
            expect(scored.isWon).toBe(false);
            expect(scored.values).toStrictEqual([]);
        });

        it('complete all values', () => {
            const sudoku = Sudoku.fromString('417352.898.27.613..6.14827.2416.53..79623.8.15389.142638546.912.29.13...1748.9.6.');

            const {
                8: { 4: cell }
            } = sudoku.Field;
            const correct = sudoku.getCorrectValue(cell);
            const scored = sudoku.setCellValue({ ...cell, value: correct });

            expect(scored.x).toBe(-1);
            expect(scored.y).toBe(-1);
            expect(scored.group).toBe(-1);
            expect(scored.isWon).toBe(false);
            expect(scored.values).toStrictEqual([2]);
        });

        it('complete whole game', () => {
            const sudoku = Sudoku.fromString('41735268985279613496314827524168539779623485153897142638546791262951374.174829563');

            const {
                7: { 8: cell }
            } = sudoku.Field;
            const correct = sudoku.getCorrectValue(cell);
            const scored = sudoku.setCellValue({ ...cell, value: correct });

            expect(scored.x).toBe(8);
            expect(scored.y).toBe(7);
            expect(scored.group).toBe(9);
            expect(scored.isWon).toBe(true);
            expect(scored.values).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });
    });
});

describe('Sudoku - Static Methods', () => {
    it('fromString should return Sudoku instance', () => {
        expect.assertions(1);

        const testFieldsString = '...469123469123875123875469784596...596231784231784596658947312947312658312658...';

        const sudoku = Sudoku.fromString(testFieldsString, defaultSudokuConfig);

        expect(sudoku).toBeInstanceOf(Sudoku);
    });
});

describe('Sudoku - Candidates', () => {
    it('getCellCandidates should return single possible cell value', () => {
        const sudoku = Sudoku.fromString('27.3459.838.6..75..598.2..45.7986.4.1264378.5498...673.6312.5.784.793.267125.84.9');

        const {
            2: { 0: cell }
        } = sudoku.Field;
        const candidates = sudoku.getCellCandidates(cell);

        expect(candidates).toStrictEqual([6]);
    });

    it('getCellCandidates should return multiple possible cell values', () => {
        const sudoku = Sudoku.fromString('27.3459.838.6..75..598.2..45.7986.4.1264378.5498...673.6312.5.784.793.267125.84.9');

        const {
            5: { 4: cell }
        } = sudoku.Field;
        const candidates = sudoku.getCellCandidates(cell);

        expect(candidates).toStrictEqual([1, 5]);
    });
});
