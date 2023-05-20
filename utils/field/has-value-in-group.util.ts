import { type CellInterface } from '../../interfaces/cell.interface';

export const hasValueInGroup = (cell: CellInterface, matrix: CellInterface[][]): boolean => {
    const boxStartY = cell.y - (cell.y % 3);
    const boxStartX = cell.x - (cell.x % 3);

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (matrix[row + boxStartY][col + boxStartX].value === cell.value) {
                return true;
            }
        }
    }

    return false;
};
