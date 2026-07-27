import { CellFontSizeDivider, MinimumCellFontSizeConstant } from '../constant/font-size.constant';

export const getCellFontSize = (cellSize: number, fontSizeMultiplier: number): number =>
    Math.max(MinimumCellFontSizeConstant, (cellSize / CellFontSizeDivider) * fontSizeMultiplier);
