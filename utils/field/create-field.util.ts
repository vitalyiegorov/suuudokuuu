import { type CellInterface } from '../../interfaces/cell.interface';
import { createCell } from '../cell/create-cell.util';

import { fillField } from './fill-field.util';

const createFillingValues = (length: number): number[] => {
    const values = Array.from({ length }, (_, i) => i + 1);
    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }

    return values;
};

export const createField = (size: number): CellInterface[][] => {
    const field: CellInterface[][] = [];

    for (let x = 0; x < size; x++) {
        const row: CellInterface[] = [];
        for (let y = 0; y < size; y++) {
            row.push(createCell(x, y));
        }
        field.push(row);
    }

    if (!fillField(field, createFillingValues(size))) {
        throw new Error('Unable to fill field');
    }

    return field;
};