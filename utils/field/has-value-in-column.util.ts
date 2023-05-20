import { type CellInterface } from '../../interfaces/cell.interface';

export const hasValueInColumn = (cell: CellInterface, matrix: CellInterface[][]): boolean => {
    for (let row = 0; row < matrix.length; row++) {
        if (matrix[row][cell.x].value === cell.value) {
            return true;
        }
    }

    return false;
};
