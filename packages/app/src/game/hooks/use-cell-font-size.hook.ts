import { useWindowDimensions } from 'react-native';

import { fontSizeMultipliers } from '../../settings/constant/font-size-multipliers.constant';
import { useSettings } from '../../settings/query/use-settings.query';
import { getCellFontSize } from '../utils/get-cell-font-size.util';

export const useCellFontSize = (boardCellSize: number) => {
    const fontSizeMultiplier = fontSizeMultipliers[useSettings().fontSize];
    const { fontScale } = useWindowDimensions();

    return getCellFontSize(boardCellSize, fontSizeMultiplier, fontScale);
};
