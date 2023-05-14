import { type CellInterface } from '../interfaces/cell.interface';

import { createCell } from './create-cell.util';
import { fillField } from './fill-field.util';

export const createField = (size: number): CellInterface[][] => {
    const field: CellInterface[][] = [];

    for (let x = 0; x < size; x++) {
        const row: CellInterface[] = [];
        for (let y = 0; y < size; y++) {
            row.push(createCell(x, y));
        }
        field.push(row);
    }

    if (!fillField(field)) {
        throw new Error('Unable to fill field');
    }

    return field;
};
