import type { FieldDirectionType } from '../types/field-direction.type';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

export const getNeighbourCell = (
    sudoku: Sudoku,
    direction: FieldDirectionType,
    selectedCell?: CellInterface
): CellInterface | undefined => {
    switch (direction) {
        case 'left':
            return sudoku.getCellLeft(selectedCell);
        case 'right':
            return sudoku.getCellRight(selectedCell);
        case 'up':
            return sudoku.getCellUp(selectedCell);
        default:
            return sudoku.getCellDown(selectedCell);
    }
};
