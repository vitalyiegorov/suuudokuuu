import { BoardCellSizeCapConstant } from '../constant/board-cell-size.constant';

import type { GameGetBoardCellSizeOptionsInterface } from '../interface/game-get-board-cell-size-options.interface';

export const gameGetBoardCellSize = ({
    availableWidth,
    availableHeight,
    sizeClass,
    panelWidth,
    gutter
}: GameGetBoardCellSizeOptionsInterface): number => {
    const widthForBoard = sizeClass === 'wide' ? availableWidth - panelWidth - gutter : availableWidth;
    const availableSize = Math.max(0, Math.min(availableHeight, widthForBoard));

    return Math.min(BoardCellSizeCapConstant, Math.floor(availableSize / 9));
};
