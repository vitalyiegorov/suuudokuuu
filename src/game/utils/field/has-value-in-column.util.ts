import { type CellInterface } from '../../../@logic/interfaces/cell.interface';
import { type FieldInterface } from '../../../@logic/interfaces/field.interface';

export const hasValueInColumn = (cell: CellInterface, field: FieldInterface): boolean => {
    for (let y = 0; y < field.length; y++) {
        if (field[y][cell.x].value === cell.value) {
            return true;
        }
    }

    return false;
};
