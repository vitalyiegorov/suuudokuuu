import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum, Sudoku } from '@suuudokuuu/generator';

import { keyboardKeyToAction } from './keyboard-key-to-action.util';

const createSudoku = () => {
    const sudoku = new Sudoku();
    sudoku.create(DifficultyEnum.Easy);

    return sudoku;
};

const getMiddleTestCell = (sudoku: Sudoku) => sudoku.Field[4][4];

describe('keyboardKeyToAction', () => {
    it('maps digits 1-9 to a select-value action when a cell is selected', () => {
        const sudoku = createSudoku();
        const selectedCell = getMiddleTestCell(sudoku);

        for (let digit = 1; digit <= 9; digit += 1) {
            expect(keyboardKeyToAction(String(digit), sudoku, selectedCell)).toStrictEqual({ type: 'select-value', value: digit });
        }
    });

    it('maps a digit to a no-op action when no cell is selected', () => {
        const sudoku = createSudoku();

        expect(keyboardKeyToAction('5', sudoku, undefined)).toStrictEqual({ type: 'noop' });
    });

    it('maps Space to a toggle-input-mode action when a cell is selected', () => {
        const sudoku = createSudoku();
        const selectedCell = getMiddleTestCell(sudoku);

        expect(keyboardKeyToAction(' ', sudoku, selectedCell)).toStrictEqual({ type: 'toggle-input-mode' });
    });

    it('maps Space to a no-op action when no cell is selected', () => {
        const sudoku = createSudoku();

        expect(keyboardKeyToAction(' ', sudoku, undefined)).toStrictEqual({ type: 'noop' });
    });

    it('maps Escape to an exit action regardless of selection', () => {
        const sudoku = createSudoku();
        const selectedCell = getMiddleTestCell(sudoku);

        expect(keyboardKeyToAction('Escape', sudoku, selectedCell)).toStrictEqual({ type: 'exit' });
        expect(keyboardKeyToAction('Escape', sudoku, undefined)).toStrictEqual({ type: 'exit' });
    });

    it('maps ArrowUp to a select-cell action delegating to sudoku.getCellUp', () => {
        const sudoku = createSudoku();
        const selectedCell = getMiddleTestCell(sudoku);

        expect(keyboardKeyToAction('ArrowUp', sudoku, selectedCell)).toStrictEqual({
            type: 'select-cell',
            cell: sudoku.getCellUp(selectedCell)
        });
    });

    it('maps ArrowDown to a select-cell action delegating to sudoku.getCellDown', () => {
        const sudoku = createSudoku();
        const selectedCell = getMiddleTestCell(sudoku);

        expect(keyboardKeyToAction('ArrowDown', sudoku, selectedCell)).toStrictEqual({
            type: 'select-cell',
            cell: sudoku.getCellDown(selectedCell)
        });
    });

    it('maps ArrowLeft to a select-cell action delegating to sudoku.getCellLeft', () => {
        const sudoku = createSudoku();
        const selectedCell = getMiddleTestCell(sudoku);

        expect(keyboardKeyToAction('ArrowLeft', sudoku, selectedCell)).toStrictEqual({
            type: 'select-cell',
            cell: sudoku.getCellLeft(selectedCell)
        });
    });

    it('maps ArrowRight to a select-cell action delegating to sudoku.getCellRight', () => {
        const sudoku = createSudoku();
        const selectedCell = getMiddleTestCell(sudoku);

        expect(keyboardKeyToAction('ArrowRight', sudoku, selectedCell)).toStrictEqual({
            type: 'select-cell',
            cell: sudoku.getCellRight(selectedCell)
        });
    });

    it('defaults to the top-left cell for arrow navigation when no cell is selected', () => {
        const sudoku = createSudoku();

        expect(keyboardKeyToAction('ArrowRight', sudoku, undefined)).toStrictEqual({
            type: 'select-cell',
            cell: sudoku.getCellRight(sudoku.Field[0][0])
        });
    });

    it('maps an unmapped key to a no-op action', () => {
        const sudoku = createSudoku();
        const selectedCell = getMiddleTestCell(sudoku);

        expect(keyboardKeyToAction('Shift', sudoku, selectedCell)).toStrictEqual({ type: 'noop' });
    });
});
