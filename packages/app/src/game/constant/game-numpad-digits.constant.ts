import { SpacingConstant } from '@suuudokuuu/ui/theme';

import { GamePanelWideRowWidthConstant } from './board-cell-size.constant';

const gameNumpadWideColumns = 3;

export const GameNumpadDigitsConstant = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const GameNumpadWideGapConstant = SpacingConstant.lg;

export const GameNumpadWideDigitSizeConstant = Math.floor(
    (GamePanelWideRowWidthConstant - GameNumpadWideGapConstant * (gameNumpadWideColumns - 1)) / gameNumpadWideColumns
);
