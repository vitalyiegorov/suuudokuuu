import { isPositiveNumber } from '@rnw-community/shared';

import { BoardCellBorderWidthConstant } from '../constant/board-cell-size.constant';

export const gameGetBoardSize = (cellSize: number, fieldSize: number): number =>
    isPositiveNumber(cellSize) ? fieldSize * (cellSize + BoardCellBorderWidthConstant) : 0;
