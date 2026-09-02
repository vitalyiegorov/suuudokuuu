import { SpacingConstant } from '@suuudokuuu/ui/theme';

import { GamePanelWideRowWidthConstant } from './board-cell-size.constant';

export const GameNumpadDigitsConstant = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const GameNumpadWideColumnsConstant = 3;

export const GameNumpadWideGapConstant = SpacingConstant.lg;

export const GameNumpadWideDigitSizeConstant = Math.floor(
    (GamePanelWideRowWidthConstant - GameNumpadWideGapConstant * (GameNumpadWideColumnsConstant - 1)) / GameNumpadWideColumnsConstant
);
