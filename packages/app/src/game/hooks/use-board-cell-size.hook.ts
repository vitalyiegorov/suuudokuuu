import { useAppLayout } from '@suuudokuuu/ui';

import { GameSidePanelGutterConstant, GameSidePanelWidthConstant } from '../constant/board-cell-size.constant';
import { gameGetBoardCellSize } from '../utils/game-get-board-cell-size.util';

export const useBoardCellSize = (containerWidth: number, containerHeight: number): number => {
    const { sizeClass } = useAppLayout();

    return gameGetBoardCellSize({
        availableWidth: containerWidth,
        availableHeight: containerHeight,
        sizeClass,
        panelWidth: GameSidePanelWidthConstant,
        gutter: GameSidePanelGutterConstant
    });
};
