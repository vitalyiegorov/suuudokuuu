import { isDefined } from '@rnw-community/shared';

import { type CellInterface } from '../../interfaces/cell.interface';

export const isSameCell = (cell: CellInterface, selectedCell?: CellInterface): boolean =>
    isDefined(selectedCell) && cell.x === selectedCell.x && cell.y === selectedCell.y;
