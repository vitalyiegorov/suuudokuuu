import { ReactNode } from 'react';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isDefined } from '@rnw-community/shared';

import { useBackdropRecomposite } from '../hook/use-backdrop-recomposite.hook';
import { useScreenChrome } from '../hook/use-screen-chrome.hook';
import { EdgeFadePosition, ScreenChromeColorSetInterface } from '../interface/screen-chrome-config.interface';

import { useEdgeFadeOpacityStyle } from './hook/use-edge-fade-opacity-style.hook';
import { EdgeFadePropsInterface } from './interface/edge-fade-props.interface';
import { WebEdgeFadeStyleInterface } from './interface/web-edge-fade-style.interface';
import { getEdgeFadeBackdropFilter } from './utils/edge-fade-get-backdrop-filter.util';
import { getEdgeFadeBandMetrics } from './utils/edge-fade-get-band-metrics.util';

const PERCENT_MULTIPLIER = 100;
const WASH_STOP_PERCENT = 72;

const buildMaskImage = (maskStops: Record<number, { readonly color: string }>): string => {
    const sortedStops = Object.entries(maskStops)
        .map(([offset, { color }]): readonly [number, string] => [Number(offset), color])
        .sort(([firstOffset], [secondOffset]) => firstOffset - secondOffset);
    const stopsCss = sortedStops.map(([offset, color]) => `${color} ${offset * PERCENT_MULTIPLIER}%`).join(', ');

    return `linear-gradient(to bottom, ${stopsCss})`;
};
const buildBackgroundImage = (colorSet: ScreenChromeColorSetInterface, position: EdgeFadePosition): string => {
    if (position === 'top') {
        return `linear-gradient(to bottom, ${colorSet.solid} 0%, ${colorSet.wash} ${WASH_STOP_PERCENT}%, transparent ${PERCENT_MULTIPLIER}%)`;
    }

    return `linear-gradient(to bottom, transparent 0%, ${colorSet.wash} ${PERCENT_MULTIPLIER - WASH_STOP_PERCENT}%, ${colorSet.solid} ${PERCENT_MULTIPLIER}%)`;
};

export const EdgeFade = ({ position, height, intensity, scrollAnimation, style }: EdgeFadePropsInterface): ReactNode => {
    const { config, colorScheme } = useScreenChrome();
    const insets = useSafeAreaInsets();

    const resolvedIntensity = isDefined(intensity) ? intensity : config.intensity;
    const colorSet = config.colors[colorScheme];
    const backdropFilter = getEdgeFadeBackdropFilter(resolvedIntensity);
    const opacityInputRange = scrollAnimation?.opacityInputRange;
    const maskImage = buildMaskImage(config.maskStops[position]);

    const animatedStyle = useEdgeFadeOpacityStyle(opacityInputRange);
    const backdropRecompositeRef = useBackdropRecomposite();

    const positionalMetrics = getEdgeFadeBandMetrics(position, height, config, insets);

    const webStyle: WebEdgeFadeStyleInterface = {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 2,
        height: positionalMetrics.height,
        top: positionalMetrics.top,
        bottom: positionalMetrics.bottom,
        backdropFilter,
        WebkitBackdropFilter: backdropFilter,
        maskImage,
        WebkitMaskImage: maskImage,
        backgroundImage: buildBackgroundImage(colorSet, position)
    };

    const combinedStyle = [webStyle, animatedStyle, style];

    return <Animated.View pointerEvents="none" aria-hidden ref={backdropRecompositeRef} style={combinedStyle} />;
};
