import { type CellInterface } from '../interfaces/cell.interface';

export const hasValueInGroup = (cell: CellInterface, matrix: CellInterface[][]): boolean => {
    const boxStartRow = cell.x - (cell.x % 3);
    const boxStartCol = cell.y - (cell.y % 3);

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (matrix[row + boxStartRow][col + boxStartCol].value === cell.value) {
                return true;
            }
        }
    }

    return false;
};
