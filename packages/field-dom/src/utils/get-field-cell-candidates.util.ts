import { getCellKey } from '@suuudokuuu/field-core';

import { getAutoCandidates } from './get-auto-candidates.util';

import type { FieldCellType } from '../types/field-cell.type';
import type { FieldSnapshotInterface } from '@suuudokuuu/field-core';

export const getFieldCellCandidates = (
    snapshot: Pick<FieldSnapshotInterface, 'candidates' | 'field' | 'showAutoCandidates'>,
    cell: FieldCellType
): number[] => (snapshot.showAutoCandidates ? getAutoCandidates(snapshot.field, cell) : (snapshot.candidates[getCellKey(cell)] ?? []));
