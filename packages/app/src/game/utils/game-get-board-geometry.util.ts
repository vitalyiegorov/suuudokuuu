import { isPositiveNumber } from '@rnw-community/shared';

import { BoardCellSizeCapConstant, BoardCellSizeMinConstant } from '../constant/board-cell-size.constant';

import type { BoardGeometryInterface } from '../interface/board-geometry.interface';
import type { GameGetBoardGeometryOptionsInterface } from '../interface/game-get-board-geometry-options.interface';

export const gameGetBoardGeometry = ({
    availableWidth,
    availableHeight,
    reservedHeight,
    fieldSize,
    fieldGroupSize,
    cellMargin
}: GameGetBoardGeometryOptionsInterface): BoardGeometryInterface => {
    const groupGapCount = Math.floor((fieldSize - 1) / fieldGroupSize);
    const constrainedHeight = Math.max(0, availableHeight - reservedHeight);
    const availableSquareSize = Math.max(0, Math.min(availableWidth, constrainedHeight));
    const minimumCellsSize = fieldSize * BoardCellSizeMinConstant;
    const spareSizeAboveMinimumCells = Math.max(0, availableSquareSize - minimumCellsSize);
    const affordableCellMargin = isPositiveNumber(groupGapCount) ? Math.floor(spareSizeAboveMinimumCells / groupGapCount) : 0;
    const effectiveCellMargin = Math.min(cellMargin, affordableCellMargin);
    const groupGapsSize = groupGapCount * effectiveCellMargin;
    const cellsSize = Math.floor((availableSquareSize - groupGapsSize) / fieldSize);
    const cellSize = Math.max(0, Math.min(BoardCellSizeCapConstant, cellsSize));

    return {
        boardSize: isPositiveNumber(cellSize) ? fieldSize * cellSize + groupGapsSize : 0,
        cellMargin: effectiveCellMargin,
        cellSize
    };
};
