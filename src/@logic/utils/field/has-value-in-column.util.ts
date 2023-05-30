import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';

/** @deprecated */
export const hasValueInColumn = (cell: CellInterface, field: FieldInterface): boolean => {
    for (const row of field) {
        if (row[cell.x].value === cell.value) {
            return true;
        }
    }

    return false;
};
