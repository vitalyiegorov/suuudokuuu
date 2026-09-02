import { SpacingConstant } from '@suuudokuuu/ui/theme';

import { GamePanelHorizontalPaddingConstant, GameSidePanelWidthConstant } from '../../../../../game/constant/board-cell-size.constant';

export const GameInputToolsCountConstant = 5;

const gameInputToolsGapsWidth = SpacingConstant.sm * (GameInputToolsCountConstant - 1);

export const GameInputToolsWideSizeConstant = Math.floor(
    (GameSidePanelWidthConstant - GamePanelHorizontalPaddingConstant * 2 - gameInputToolsGapsWidth) / GameInputToolsCountConstant
);
