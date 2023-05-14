import { isDefined } from '@rnw-community/shared';

import { type CellInterface } from '../../interfaces/cell.interface';

export const isSameCell = (cell: CellInterface, comparedCell?: CellInterface): boolean =>
    isDefined(comparedCell) && cell.x === comparedCell.x && cell.y === comparedCell.y;
