import { isSameCell } from './is-same-cell.util';

import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { CellInterface } from '@suuudokuuu/generator';

export const isForcedPlacement = (context: CandidateContext, cell: CellInterface, value: number): boolean => {
    const candidates = context.getCandidates(cell);

    if (!candidates.includes(value)) {
        return false;
    }

    if (candidates.length === 1) {
        return true;
    }

    const unitCells = [context.getRowCells(cell.y), context.getColumnCells(cell.x), context.getGroupCells(cell)];

    return unitCells.some(cells => cells.every(unitCell => isSameCell(unitCell, cell) || !context.getCandidates(unitCell).includes(value)));
};
