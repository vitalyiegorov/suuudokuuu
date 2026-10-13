import { MaxFontSizeMultiplierConstant, SpacingConstant } from '@suuudokuuu/ui/theme';

const compactButtonHeight = 44;
const twoLineLabelHeight = 40;

export const gameGetHintFooterHeight = (fontScale: number): number =>
    Math.max(compactButtonHeight, twoLineLabelHeight * Math.min(fontScale, MaxFontSizeMultiplierConstant) + SpacingConstant.sm);
