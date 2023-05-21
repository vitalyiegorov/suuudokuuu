import { BlankCellValueConstant } from '../../constants/blank-cell-value.constant';
import { type CellInterface } from '../../interfaces/cell.interface';

export const hasBlankCells = (field: CellInterface[][]): [hasBlankCells: boolean, lastY: number, lastX: number] => {
    let y = 0;
    let x = 0;

    for (y = 0; y < field.length; y++) {
        for (x = 0; x < field[y].length; x++) {
            if (field[y][x].value === BlankCellValueConstant) {
                return [true, y, x];
            }
        }
    }

    return [false, y, x];
};
