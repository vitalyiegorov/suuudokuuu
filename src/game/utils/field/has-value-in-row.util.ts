import { type CellInterface } from '../../interfaces/cell.interface';
import { type FieldInterface } from '../../interfaces/field.interface';

export const hasValueInRow = (cell: CellInterface, field: FieldInterface): boolean => {
    for (let x = 0; x < field.length; x++) {
        if (field[cell.y][x].value === cell.value) {
            return true;
        }
    }

    return false;
};
