import { isDefined } from '@rnw-community/shared';

import { type CellInterface } from '../interfaces/cell.interface';

export const isCellHighlighted = (cell: CellInterface, activeCell?: CellInterface): boolean => {
    return isDefined(activeCell) && (activeCell.x === cell.x || activeCell.y === cell.y || activeCell.group === cell.group);
};
