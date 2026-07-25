import { easeGradient } from 'react-native-easing-gradient';

import { EdgeFadePosition, ScreenChromeConfigInterface } from '../../interface/screen-chrome-config.interface';

export const getEdgeFadeMaskStops = (maskStops: ScreenChromeConfigInterface['maskStops'], position: EdgeFadePosition) =>
    easeGradient({ colorStops: maskStops[position] });
