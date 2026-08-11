import { isDefined } from '@rnw-community/shared';

import { ENTRY_GRID_SIZE } from '../constants/puzzle-entry.constant';

const NO_OFFSET = 0;
const COLUMN_OFFSETS: Record<string, number | undefined> = { ArrowLeft: -1, ArrowRight: 1 };
const ROW_OFFSETS: Record<string, number | undefined> = { ArrowUp: -1, ArrowDown: 1 };

const clampToGrid = (value: number): number => Math.min(Math.max(value, 0), ENTRY_GRID_SIZE - 1);

export const moveEntrySelection = (index: number, key: string): number | null => {
    const columnOffset = COLUMN_OFFSETS[key];
    const rowOffset = ROW_OFFSETS[key];

    if (!isDefined(columnOffset) && !isDefined(rowOffset)) {
        return null;
    }

    const nextColumn = clampToGrid((index % ENTRY_GRID_SIZE) + (columnOffset ?? NO_OFFSET));
    const nextRow = clampToGrid(Math.floor(index / ENTRY_GRID_SIZE) + (rowOffset ?? NO_OFFSET));

    return nextRow * ENTRY_GRID_SIZE + nextColumn;
};
