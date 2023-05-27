import { type CellInterface } from '../../interfaces/cell.interface';
import { type FieldInterface } from '../../interfaces/field.interface';
import { createCell } from '../create-cell.util';

import { fillField } from './fill-field.util';

const createFillingValues = (length: number): number[] => {
    const values = Array.from({ length }, (_, i) => i + 1);
    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }

    return values;
};

export const createField = (size: number): FieldInterface => {
    const field: FieldInterface = [];

    for (let y = 0; y < size; y++) {
        const row: CellInterface[] = [];
        for (let x = 0; x < size; x++) {
            row.push(createCell(x, y));
        }
        field.push(row);
    }

    if (!fillField(field, createFillingValues(size))) {
        throw new Error('Unable to fill field');
    }

    return field;
};
