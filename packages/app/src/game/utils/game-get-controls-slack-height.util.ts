import { SpacingConstant } from '@suuudokuuu/ui/theme';

import { gameGetHintFooterHeight } from './game-get-hint-footer-height.util';

export const gameGetControlsSlackHeight = (fontScale: number): number =>
    SpacingConstant.xl * 3 + gameGetHintFooterHeight(fontScale) - gameGetHintFooterHeight(1);
