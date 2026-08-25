import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { gameGetArrowTargetCell } from './game-get-arrow-target-cell.util';

const blankBoard = '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize);
const sudoku = Sudoku.fromString(blankBoard, defaultSudokuConfig);
const getCell = (y: number, x: number) => sudoku.Field[y][x];

describe('gameGetArrowTargetCell', () => {
    it('moves one cell in each direction from the center', () => {
        expect(gameGetArrowTargetCell(sudoku, getCell(4, 4), 'ArrowUp')).toStrictEqual(getCell(3, 4));
        expect(gameGetArrowTargetCell(sudoku, getCell(4, 4), 'ArrowDown')).toStrictEqual(getCell(5, 4));
        expect(gameGetArrowTargetCell(sudoku, getCell(4, 4), 'ArrowLeft')).toStrictEqual(getCell(4, 3));
        expect(gameGetArrowTargetCell(sudoku, getCell(4, 4), 'ArrowRight')).toStrictEqual(getCell(4, 5));
    });

    it('clamps at every edge of the board', () => {
        expect(gameGetArrowTargetCell(sudoku, getCell(0, 0), 'ArrowUp')).toStrictEqual(getCell(0, 0));
        expect(gameGetArrowTargetCell(sudoku, getCell(0, 0), 'ArrowLeft')).toStrictEqual(getCell(0, 0));
        expect(gameGetArrowTargetCell(sudoku, getCell(8, 8), 'ArrowDown')).toStrictEqual(getCell(8, 8));
        expect(gameGetArrowTargetCell(sudoku, getCell(8, 8), 'ArrowRight')).toStrictEqual(getCell(8, 8));
    });
});
