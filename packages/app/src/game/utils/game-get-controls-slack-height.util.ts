import { MaxFontSizeMultiplierConstant, SpacingConstant } from '@suuudokuuu/ui/theme';

import { HintNarrationLineHeightConstant } from '../constant/hint-narration-line-height.constant';

import { gameGetHintFooterHeight } from './game-get-hint-footer-height.util';

const narrationGrowthLineCount = 2;

export const gameGetControlsSlackHeight = (fontScale: number): number =>
    SpacingConstant.xl +
    gameGetHintFooterHeight(fontScale) -
    gameGetHintFooterHeight(1) +
    narrationGrowthLineCount * HintNarrationLineHeightConstant * Math.max(Math.min(fontScale, MaxFontSizeMultiplierConstant) - 1, 0);
