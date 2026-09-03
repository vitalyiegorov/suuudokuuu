import { SpacingConstant } from '@suuudokuuu/ui/theme';

import { AppIconButtonSize } from '../../../../../@generic/components/app-icon-button/constant/app-icon-button-size.constant';
import { GamePanelWideRowWidthConstant } from '../../../../../game/constant/board-cell-size.constant';
import { PanelControlPrimarySizeConstant } from '../../../../../game/constant/panel-control-size.constant';

export const GameInputToolsCountConstant = 5;

const gameInputToolsGapsWidth = SpacingConstant.sm * (GameInputToolsCountConstant - 1);

export const GameInputToolsWideSizeConstant = Math.floor(
    (GamePanelWideRowWidthConstant - gameInputToolsGapsWidth) / GameInputToolsCountConstant
);

export const GameInputToolsMinRowWidthConstant =
    AppIconButtonSize * (GameInputToolsCountConstant - 1) + PanelControlPrimarySizeConstant + gameInputToolsGapsWidth;
