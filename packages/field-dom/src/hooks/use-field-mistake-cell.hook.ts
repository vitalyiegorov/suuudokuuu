import { useEffect, useState } from 'react';

import { getVisibleMistakeCell } from '../utils/get-visible-mistake-cell.util';

import type { FieldMistakeRecordInterface } from '../interfaces/field-mistake-record.interface';
import type { FieldCellType } from '../types/field-cell.type';
import type { FieldEngine, FieldSnapshotInterface } from '@suuudokuuu/field-core';

export const useFieldMistakeCell = (engine: FieldEngine, snapshot: FieldSnapshotInterface): FieldCellType | null => {
    const [mistakeRecord, setMistakeRecord] = useState<FieldMistakeRecordInterface | null>(null);

    useEffect(
        () =>
            engine.on('mistake', ({ cell, mistakes }) => {
                setMistakeRecord({ cell, mistakes, sudokuString: engine.getSnapshot().sudokuString });
            }),
        [engine]
    );

    return getVisibleMistakeCell(mistakeRecord, snapshot);
};
