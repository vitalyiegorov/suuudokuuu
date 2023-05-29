import { type FieldInterface } from '../../../@logic/interfaces/field.interface';
import { BlankCellValueConstant } from '../../constants/blank-cell-value.constant';

export const hasBlankCells = (field: FieldInterface): [hasBlankCells: boolean, lastY: number, lastX: number] => {
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
