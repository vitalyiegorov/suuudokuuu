import { BlankCellValue } from '../interfaces/blank-cell-value';
import { type CellInterface } from '../interfaces/cell.interface';

import { createCell } from './create-cell.util';
import { hasBlankCells } from './has-blank-cells.util';
import { hasValueInColumn } from './has-value-in-column.util';
import { hasValueInGroup } from './has-value-in-group.util';
import { hasValueInRow } from './has-value-in-row.util';

const isSafe = (cell: CellInterface, matrix: CellInterface[][]): boolean => {
    return !hasValueInRow(cell, matrix) && !hasValueInColumn(cell, matrix) && !hasValueInGroup(cell, matrix);
};

export const fillField = (field: CellInterface[][]): boolean => {
    const [needsFilling, x, y] = hasBlankCells(field);

    if (!needsFilling) {
        return true;
    }

    for (let value = 1; value <= 9; value++) {
        const newCell: CellInterface = createCell(x, y, value);

        if (isSafe(newCell, field)) {
            field[x][y] = newCell;

            if (fillField(field)) {
                return true;
            }

            field[x][y].value = BlankCellValue;
        }
    }

    return false;
};
