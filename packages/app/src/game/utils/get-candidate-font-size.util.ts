import {
    CandidateFontSizeCapDivider,
    CandidateFontSizeDivider,
    MinimumBoardFontScaleConstant,
    MinimumCellFontSizeConstant
} from '../constant/font-size.constant';

export const getCandidateFontSize = (cellSize: number, fontSizeMultiplier: number, fontScale: number): number => {
    const effectiveFontScale = Math.max(MinimumBoardFontScaleConstant, fontScale);
    const requestedFontSize = (cellSize / CandidateFontSizeDivider) * fontSizeMultiplier * effectiveFontScale;
    const candidateGridFitFontSize = cellSize / CandidateFontSizeCapDivider;

    return Math.max(MinimumCellFontSizeConstant, Math.min(requestedFontSize, candidateGridFitFontSize));
};
