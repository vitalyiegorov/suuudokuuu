import { type CellInterface } from '../../interfaces/cell.interface';
import { type FieldInterface } from '../../interfaces/field.interface';

export const hasValueInColumn = (cell: CellInterface, field: FieldInterface): boolean => {
    for (let row = 0; row < field.length; row++) {
        if (field[row][cell.x].value === cell.value) {
            return true;
        }
    }

    return false;
};
