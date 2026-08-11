import { BLANK_CELL_VALUE } from '../constants/field-grid.constant';

import type { FieldCellType } from '../types/field-cell.type';
import type { FieldType } from '../types/field.type';

export const getAutoCandidates = (field: FieldType, cell: FieldCellType): number[] => {
    if (cell.value !== BLANK_CELL_VALUE) {
        return [];
    }

    const peerValues = new Set<number>();

    for (const row of field) {
        for (const peerCell of row) {
            if (peerCell.value !== BLANK_CELL_VALUE && (peerCell.x === cell.x || peerCell.y === cell.y || peerCell.group === cell.group)) {
                peerValues.add(peerCell.value);
            }
        }
    }

    return Array.from({ length: field.length }, (_, index) => index + 1).filter(value => !peerValues.has(value));
};
