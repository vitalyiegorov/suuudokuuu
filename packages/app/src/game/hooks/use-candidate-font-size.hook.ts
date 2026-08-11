import { useWindowDimensions } from 'react-native';

import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { settingsFontSizeMultiplierSelector } from '../../settings/store/settings.selectors';
import { getCandidateFontSize } from '../utils/get-candidate-font-size.util';

export const useCandidateFontSize = (boardCellSize: number) => {
    const fontSizeMultiplier = useAppSelector(settingsFontSizeMultiplierSelector);
    const { fontScale } = useWindowDimensions();

    return getCandidateFontSize(boardCellSize, fontSizeMultiplier, fontScale);
};
