import {
    CellFontSizeCapDivider,
    CellFontSizeDivider,
    MinimumBoardFontScaleConstant,
    MinimumCellFontSizeConstant
} from '../constant/font-size.constant';

export const getCellFontSize = (cellSize: number, fontSizeMultiplier: number, fontScale: number): number => {
    const effectiveFontScale = Math.max(MinimumBoardFontScaleConstant, fontScale);
    const requestedFontSize = (cellSize / CellFontSizeDivider) * fontSizeMultiplier * effectiveFontScale;
    const cellFitFontSize = cellSize / CellFontSizeCapDivider;

    return Math.max(MinimumCellFontSizeConstant, Math.min(requestedFontSize, cellFitFontSize));
};
