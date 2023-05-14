import { type CellInterface } from '../interfaces/cell.interface';

import { hasValueInColumn } from './has-value-in-column.util';
import { hasValueInGroup } from './has-value-in-group.util';
import { hasValueInRow } from './has-value-in-row.util';

export const isCorrectCell = (cell: CellInterface, matrix: CellInterface[][]): boolean => {
    return !hasValueInRow(cell, matrix) && !hasValueInColumn(cell, matrix) && !hasValueInGroup(cell, matrix);
};
