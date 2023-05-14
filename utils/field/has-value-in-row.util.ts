import { type CellInterface } from '../../interfaces/cell.interface';

export const hasValueInRow = (cell: CellInterface, matrix: CellInterface[][]): boolean => {
    for (let col = 0; col < matrix.length; col++) {
        if (matrix[cell.x][col].value === cell.value) {
            return true;
        }
    }

    return false;
};
