import { MinimumBoardFontScaleConstant, MinimumCellFontSizeConstant } from '../constant/font-size.constant';

export const getFittedFontSize = (
    requestedFontSize: number,
    maximumFontSize: number,
    fontSizeMultiplier: number,
    fontScale: number
): number =>
    Math.max(
        MinimumCellFontSizeConstant,
        Math.min(requestedFontSize * fontSizeMultiplier * Math.max(MinimumBoardFontScaleConstant, fontScale), maximumFontSize)
    );
