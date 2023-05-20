import { BlankCellValueContant } from '../../constants/blank-cell-value.contant';
import { type CellInterface } from '../../interfaces/cell.interface';

export const hasBlankCells = (field: CellInterface[][]): [boolean, number, number] => {
    let row = 0;
    let col = 0;

    for (row = 0; row < field.length; row++) {
        for (col = 0; col < field[row].length; col++) {
            if (field[row][col].value === BlankCellValueContant) {
                return [true, row, col];
            }
        }
    }

    return [false, row, col];
};
