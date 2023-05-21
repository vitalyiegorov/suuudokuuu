import { isDefined } from '@rnw-community/shared';

import { BlankCellValueConstant } from '../../constants/blank-cell-value.constant';
import { type CellInterface } from '../../interfaces/cell.interface';

export const isSameCellValue = (cell: CellInterface, selectedCell?: CellInterface): boolean =>
    isDefined(selectedCell) && cell.value === selectedCell?.value && cell.value !== BlankCellValueConstant;
