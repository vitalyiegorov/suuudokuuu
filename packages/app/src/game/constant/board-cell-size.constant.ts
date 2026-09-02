import { SpacingConstant } from '@suuudokuuu/ui/theme';

import { PanelControlPrimarySizeConstant } from './panel-control-size.constant';

export const BoardCellSizeCapConstant = 128;
export const BoardCellSizeMinConstant = 44;
export const GameSidePanelWidthConstant = 320;
export const GamePanelHorizontalPaddingConstant = SpacingConstant.sm;
export const GamePanelWideRowWidthConstant = GameSidePanelWidthConstant - GamePanelHorizontalPaddingConstant * 2;
export const GameToolsSlotReservedHeightConstant = PanelControlPrimarySizeConstant + SpacingConstant.sm;
