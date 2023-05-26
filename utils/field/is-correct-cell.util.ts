import { type CellInterface } from '../../interfaces/cell.interface';
import { type FieldInterface } from '../../interfaces/field.interface';

import { hasValueInColumn } from './has-value-in-column.util';
import { hasValueInGroup } from './has-value-in-group.util';
import { hasValueInRow } from './has-value-in-row.util';

export const isCorrectCell = (cell: CellInterface, field: FieldInterface): boolean => {
    return !hasValueInRow(cell, field) && !hasValueInColumn(cell, field) && !hasValueInGroup(cell, field);
};
