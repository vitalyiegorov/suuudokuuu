import { EdgeInsets } from 'react-native-safe-area-context';

import { isDefined } from '@rnw-community/shared';

import { EdgeFadePosition, ScreenChromeConfigInterface } from '../../interface/screen-chrome-config.interface';

interface EdgeFadeBandMetricsInterface {
    readonly height: number;
    readonly top?: number;
    readonly bottom?: number;
}

export const getEdgeFadeBandMetrics = (
    position: EdgeFadePosition,
    height: number | undefined,
    config: ScreenChromeConfigInterface,
    insets: EdgeInsets
): EdgeFadeBandMetricsInterface => {
    const defaultHeight = position === 'top' ? config.topFadeHeight : config.bottomFadeHeight;
    const resolvedHeight = isDefined(height) ? height : defaultHeight;
    const inset = position === 'top' ? insets.top : insets.bottom;

    return {
        height: resolvedHeight + inset,
        ...(position === 'top' ? { top: -inset } : { bottom: -inset })
    };
};
