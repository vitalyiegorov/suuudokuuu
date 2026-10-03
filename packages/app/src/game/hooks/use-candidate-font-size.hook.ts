import { useWindowDimensions } from 'react-native';

import { fontSizeMultipliers } from '../../settings/constant/font-size-multipliers.constant';
import { useSettings } from '../../settings/query/use-settings.query';
import { getCandidateFontSize } from '../utils/get-candidate-font-size.util';

export const useCandidateFontSize = (boardCellSize: number) => {
    const fontSizeMultiplier = fontSizeMultipliers[useSettings().fontSize];
    const { fontScale } = useWindowDimensions();

    return getCandidateFontSize(boardCellSize, fontSizeMultiplier, fontScale);
};
