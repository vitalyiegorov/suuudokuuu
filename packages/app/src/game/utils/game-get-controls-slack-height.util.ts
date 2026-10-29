import { SpacingConstant } from '@suuudokuuu/ui/theme';

import { GameToolsSlotReservedHeightConstant } from '../constant/board-cell-size.constant';

import { gameGetHintFooterHeight } from './game-get-hint-footer-height.util';
import { gameGetHintMinHeight } from './game-get-hint-min-height.util';
import { gameGetNumpadHeight } from './game-get-numpad-height.util';

export const gameGetControlsSlackHeight = (fontScale: number, screenWidth: number): number =>
    Math.max(
        SpacingConstant.xl + gameGetHintFooterHeight(fontScale) - gameGetHintFooterHeight(1),
        gameGetHintMinHeight(fontScale) + SpacingConstant.md * 3 - GameToolsSlotReservedHeightConstant - gameGetNumpadHeight(screenWidth)
    );
