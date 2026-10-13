import { useWindowDimensions } from 'react-native';

import { fontSizeMultipliers } from '../../settings/constant/font-size-multipliers.constant';
import { useSettings } from '../../settings/query/use-settings.query';
import { CellFontSizeCapDivider, CellFontSizeDivider } from '../constant/font-size.constant';
import { getFittedFontSize } from '../utils/get-fitted-font-size.util';

export const useCellFontSize = (boardCellSize: number) => {
    const fontSizeMultiplier = fontSizeMultipliers[useSettings().fontSize];
    const { fontScale } = useWindowDimensions();

    return getFittedFontSize(boardCellSize / CellFontSizeDivider, boardCellSize / CellFontSizeCapDivider, fontSizeMultiplier, fontScale);
};
