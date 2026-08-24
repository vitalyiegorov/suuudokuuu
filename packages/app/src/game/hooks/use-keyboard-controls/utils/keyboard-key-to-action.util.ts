import { isDefined } from '@rnw-community/shared';

import type { KeyboardActionInterface } from '../interface/keyboard-action.interface';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

const ArrowKeysConstant = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

const getNextCellForArrowKey = (key: string, sudoku: Sudoku, selectedCell: CellInterface | undefined): CellInterface | undefined => {
    const currentCell = selectedCell ?? sudoku.Field[0][0];
    const lastRowIndex = sudoku.Field.length - 1;
    const lastColIndex = sudoku.Field[currentCell.y].length - 1;

    const cellByArrowKey: Record<string, CellInterface | undefined> = {
        ArrowUp: currentCell.y > 0 ? sudoku.getCellUp(currentCell) : sudoku.Field[lastRowIndex][currentCell.x],
        ArrowDown: currentCell.y < lastRowIndex ? sudoku.getCellDown(currentCell) : sudoku.Field[0][currentCell.x],
        ArrowLeft: currentCell.x > 0 ? sudoku.getCellLeft(currentCell) : sudoku.Field[currentCell.y][lastColIndex],
        ArrowRight: currentCell.x < lastColIndex ? sudoku.getCellRight(currentCell) : sudoku.Field[currentCell.y][0]
    };

    return cellByArrowKey[key];
};

export const keyboardKeyToAction = (key: string, sudoku: Sudoku, selectedCell: CellInterface | undefined): KeyboardActionInterface => {
    if (ArrowKeysConstant.includes(key)) {
        return { type: 'select-cell', cell: getNextCellForArrowKey(key, sudoku, selectedCell) };
    }

    if (key === ' ' && isDefined(selectedCell)) {
        return { type: 'toggle-input-mode' };
    }

    if (key === 'Escape') {
        return { type: 'exit' };
    }

    if (key === 'z' || key === 'Z') {
        return { type: 'undo' };
    }

    if (key === 'y' || key === 'Y') {
        return { type: 'redo' };
    }

    if (isDefined(selectedCell) && /^[1-9]$/iu.test(key)) {
        return { type: 'select-value', value: Number(key) };
    }

    return { type: 'noop' };
};
