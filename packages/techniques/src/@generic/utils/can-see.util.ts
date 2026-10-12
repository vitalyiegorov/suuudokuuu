import { isSameCell } from './is-same-cell.util';

import type { CellInterface } from '@suuudokuuu/generator';

export const canSee = (cell: CellInterface, otherCell: CellInterface): boolean =>
    !isSameCell(cell, otherCell) && (cell.x === otherCell.x || cell.y === otherCell.y || cell.group === otherCell.group);
