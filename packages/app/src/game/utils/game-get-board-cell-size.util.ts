import { BoardCellSizeCapConstant } from '../constant/board-cell-size.constant';

import type { GameGetBoardCellSizeOptionsInterface } from '../interface/game-get-board-cell-size-options.interface';

export const gameGetBoardCellSize = ({ availableWidth, availableHeight, fieldSize }: GameGetBoardCellSizeOptionsInterface): number => {
    const squareSize = Math.max(0, Math.min(availableWidth, availableHeight));

    return Math.min(BoardCellSizeCapConstant, Math.floor(squareSize / fieldSize));
};
