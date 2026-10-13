import { BLANK_CELL_VALUE } from '../constants/field-grid.constant';

import type { FieldPadValueInterface } from '../interfaces/field-pad-value.interface';
import type { FieldSnapshotInterface } from '@suuudokuuu/field-core';

export const buildFieldPadValues = (field: FieldSnapshotInterface['field']): FieldPadValueInterface[] => {
    const fieldSize = field.length;
    const placedCounts = new Map<number, number>();

    for (const row of field) {
        for (const cell of row) {
            if (cell.value !== BLANK_CELL_VALUE) {
                placedCounts.set(cell.value, (placedCounts.get(cell.value) ?? 0) + 1);
            }
        }
    }

    return Array.from({ length: fieldSize }, (_, index) => index + 1).map(value => {
        const remaining = fieldSize - (placedCounts.get(value) ?? 0);

        return { value, remaining, isComplete: remaining <= 0 };
    });
};
