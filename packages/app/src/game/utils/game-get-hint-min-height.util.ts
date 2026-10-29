import { CompactMaxFontSizeMultiplierConstant, MaxFontSizeMultiplierConstant, SpacingConstant } from '@suuudokuuu/ui/theme';

import { gameGetHintFooterHeight } from './game-get-hint-footer-height.util';

const headerLineHeight = 18;
const chainLineHeight = 16;
const narrationLineHeight = 22;
const footerLineHeight = 18;
const minimumNarrationLines = 2;
const maximumHeaderLines = 2;
const maximumFooterLines = 6;
const panelBorderWidth = 1;
const compactHeaderHeight = 44;

export const gameGetHintMinHeight = (fontScale: number): number => {
    const textScale = Math.min(fontScale, MaxFontSizeMultiplierConstant);
    const compactTextScale = Math.min(fontScale, CompactMaxFontSizeMultiplierConstant);
    const headerHeight = fontScale > 1 ? maximumHeaderLines * (headerLineHeight + chainLineHeight) * compactTextScale : compactHeaderHeight;
    const narrationHeight = minimumNarrationLines * narrationLineHeight * textScale;
    const footerHeight =
        fontScale > 1
            ? Math.max(gameGetHintFooterHeight(fontScale), maximumFooterLines * footerLineHeight * compactTextScale)
            : gameGetHintFooterHeight(fontScale);

    return headerHeight + narrationHeight + footerHeight + SpacingConstant.md * 2 + SpacingConstant.xs * 3 + panelBorderWidth * 2;
};
