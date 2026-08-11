import { isDefined } from '@rnw-community/shared';

import type { FieldMistakeRecordInterface } from '../interfaces/field-mistake-record.interface';
import type { FieldCellType } from '../types/field-cell.type';
import type { FieldSnapshotInterface } from '@suuudokuuu/field-core';

export const getVisibleMistakeCell = (
    mistakeRecord: FieldMistakeRecordInterface | null,
    snapshot: Pick<FieldSnapshotInterface, 'mistakes' | 'sudokuString'>
): FieldCellType | null => {
    if (!isDefined(mistakeRecord)) {
        return null;
    }

    const isVisible = mistakeRecord.mistakes === snapshot.mistakes && mistakeRecord.sudokuString === snapshot.sudokuString;

    return isVisible ? mistakeRecord.cell : null;
};
