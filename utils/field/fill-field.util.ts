import { BlankCellValueConstant } from '../../constants/blank-cell-value.constant';
import { type CellInterface } from '../../interfaces/cell.interface';
import { type FieldInterface } from '../../interfaces/field.interface';
import { createCell } from '../cell/create-cell.util';

import { hasBlankCells } from './has-blank-cells.util';
import { isCorrectCell } from './is-correct-cell.util';

export const fillField = (field: FieldInterface, values: number[]): boolean => {
    const [needsFilling, y, x] = hasBlankCells(field);

    if (!needsFilling) {
        return true;
    }

    for (const value of values) {
        const newCell: CellInterface = createCell(x, y, value);

        if (isCorrectCell(newCell, field)) {
            field[y][x] = newCell;

            if (fillField(field, values)) {
                return true;
            }

            field[y][x].value = BlankCellValueConstant;
        }
    }

    return false;
};
