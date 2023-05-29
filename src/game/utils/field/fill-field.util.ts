import { type CellInterface } from '../../../@logic/interfaces/cell.interface';
import { type FieldInterface } from '../../../@logic/interfaces/field.interface';
import { BlankCellValueConstant } from '../../constants/blank-cell-value.constant';
import { createCell } from '../create-cell.util';

import { hasBlankCells } from './has-blank-cells.util';
import { hasValueInColumn } from './has-value-in-column.util';
import { hasValueInGroup } from './has-value-in-group.util';
import { hasValueInRow } from './has-value-in-row.util';

const isCorrectCell = (cell: CellInterface, field: FieldInterface): boolean => {
    return !hasValueInRow(cell, field) && !hasValueInColumn(cell, field) && !hasValueInGroup(cell, field);
};

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
