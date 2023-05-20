import { BlankCellValueContant } from '../../constants/blank-cell-value.contant';
import { type CellInterface } from '../../interfaces/cell.interface';
import { createCell } from '../cell/create-cell.util';

import { hasBlankCells } from './has-blank-cells.util';
import { isCorrectCell } from './is-correct-cell.util';

export const fillField = (field: CellInterface[][], values: number[]): boolean => {
    const [needsFilling, x, y] = hasBlankCells(field);

    if (!needsFilling) {
        return true;
    }

    for (const value of values) {
        const newCell: CellInterface = createCell(x, y, value);

        if (isCorrectCell(newCell, field)) {
            field[x][y] = newCell;

            if (fillField(field, values)) {
                return true;
            }

            field[x][y].value = BlankCellValueContant;
        }
    }

    return false;
};
