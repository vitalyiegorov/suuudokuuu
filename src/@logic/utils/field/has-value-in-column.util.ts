import { type CellInterface } from '../../interfaces/cell.interface';
import { type FieldInterface } from '../../interfaces/field.interface';

/** @deprecated */
export const hasValueInColumn = (cell: CellInterface, field: FieldInterface): boolean => {
    for (let y = 0; y < field.length; y++) {
        if (field[y][cell.x].value === cell.value) {
            return true;
        }
    }

    return false;
};
