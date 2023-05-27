import { type CellInterface } from '../../interfaces/cell.interface';
import { type FieldInterface } from '../../interfaces/field.interface';

export const hasValueInRow = (cell: CellInterface, field: FieldInterface): boolean => {
    for (let col = 0; col < field.length; col++) {
        if (field[cell.y][col].value === cell.value) {
            return true;
        }
    }

    return false;
};
