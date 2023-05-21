import { isDefined } from '@rnw-community/shared';

import { type CellInterface } from '../../interfaces/cell.interface';

export const isCellHighlighted = (cell: CellInterface, selectedCell?: CellInterface): boolean => {
    return isDefined(selectedCell) && (selectedCell.x === cell.x || selectedCell.y === cell.y || selectedCell.group === cell.group);
};
