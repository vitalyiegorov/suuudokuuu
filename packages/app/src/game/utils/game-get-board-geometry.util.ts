import { isPositiveNumber } from '@rnw-community/shared';

import { BoardCellSizeCapConstant } from '../constant/board-cell-size.constant';

import type { BoardGeometryInterface } from '../interface/board-geometry.interface';
import type { GameGetBoardGeometryOptionsInterface } from '../interface/game-get-board-geometry-options.interface';

export const gameGetBoardGeometry = ({
    availableWidth,
    availableHeight,
    fieldSize,
    fieldGroupSize,
    cellMargin
}: GameGetBoardGeometryOptionsInterface): BoardGeometryInterface => {
    const groupGapCount = Math.floor((fieldSize - 1) / fieldGroupSize);
    const groupGapsSize = groupGapCount * cellMargin;
    const availableSquareSize = Math.max(0, Math.min(availableWidth, availableHeight));
    const cellsSize = Math.floor((availableSquareSize - groupGapsSize) / fieldSize);
    const cellSize = Math.max(0, Math.min(BoardCellSizeCapConstant, cellsSize));

    return { cellSize, boardSize: isPositiveNumber(cellSize) ? fieldSize * cellSize + groupGapsSize : 0 };
};
