import { getCellKey } from '@suuudokuuu/field-core';

import { getAutoCandidates } from './get-auto-candidates.util';

import type { FieldCellType } from '../types/field-cell.type';
import type { FieldSnapshotInterface } from '@suuudokuuu/field-core';

export const getFieldCellCandidates = (
    snapshot: Pick<FieldSnapshotInterface, 'candidates' | 'eliminatedCandidates' | 'field' | 'showAutoCandidates'>,
    cell: FieldCellType
): number[] => {
    if (!snapshot.showAutoCandidates) {
        return snapshot.candidates[getCellKey(cell)] ?? [];
    }

    const eliminatedCandidates = snapshot.eliminatedCandidates[getCellKey(cell)] ?? [];

    return getAutoCandidates(snapshot.field, cell).filter(candidate => !eliminatedCandidates.includes(candidate));
};
