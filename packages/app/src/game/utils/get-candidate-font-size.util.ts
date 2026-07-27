import { CandidateFontSizeCapDivider, CandidateFontSizeDivider, MinimumCellFontSizeConstant } from '../constant/font-size.constant';

export const getCandidateFontSize = (cellSize: number, fontSizeMultiplier: number): number =>
    Math.max(
        MinimumCellFontSizeConstant,
        Math.min((cellSize / CandidateFontSizeDivider) * fontSizeMultiplier, cellSize / CandidateFontSizeCapDivider)
    );
