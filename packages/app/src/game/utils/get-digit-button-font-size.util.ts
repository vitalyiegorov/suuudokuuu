import {
    DigitButtonFontSizeCapDivider,
    DigitButtonFontSizeDivider,
    MinimumBoardFontScaleConstant,
    MinimumCellFontSizeConstant
} from '../constant/font-size.constant';

export const getDigitButtonFontSize = (digitSize: number, fontSizeMultiplier: number, fontScale: number): number => {
    const effectiveFontScale = Math.max(MinimumBoardFontScaleConstant, fontScale);
    const requestedFontSize = (digitSize / DigitButtonFontSizeDivider) * fontSizeMultiplier * effectiveFontScale;
    const buttonFitFontSize = digitSize / DigitButtonFontSizeCapDivider;

    return Math.max(MinimumCellFontSizeConstant, Math.min(requestedFontSize, buttonFitFontSize));
};
