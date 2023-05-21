import { isDefined } from '@rnw-community/shared';

import { BlankCellValueContant } from '../../constants/blank-cell-value.contant';
import { type CellInterface } from '../../interfaces/cell.interface';

export const isSameCellValue = (cell: CellInterface, selectedCell?: CellInterface): boolean =>
    isDefined(selectedCell) && cell.value === selectedCell?.value && cell.value !== BlankCellValueContant;
