import { useWindowDimensions } from 'react-native';

import { fontSizeMultipliers } from '../../settings/constant/font-size-multipliers.constant';
import { useSettings } from '../../settings/query/use-settings.query';
import { DigitButtonStyles } from '../styles/digit-button.styles';

export const useDigitTextStyle = () => {
    const { fontScale } = useWindowDimensions();
    const { fontSize } = useSettings();

    return DigitButtonStyles.digitText(fontSizeMultipliers[fontSize], fontScale);
};
