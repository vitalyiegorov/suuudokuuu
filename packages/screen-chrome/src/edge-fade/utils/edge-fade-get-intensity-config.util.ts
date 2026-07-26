import { isDefined } from '@rnw-community/shared';

import { ColorSchemeEnum } from '../../enum/color-scheme.enum';
import { ScreenChromeConfigInterface } from '../../interface/screen-chrome-config.interface';
import { EdgeFadeScrollAnimationInterface } from '../interface/edge-fade-scroll-animation.interface';

interface EdgeFadeIntensityConfigInterface {
    readonly opacityInputRange: readonly [number, number] | undefined;
    readonly intensityInputRange: readonly [number, number] | undefined;
    readonly scaledIntensity: number;
    readonly scaledMaxIntensity: number;
}

export const getEdgeFadeIntensityConfig = (
    intensity: number | undefined,
    scrollAnimation: EdgeFadeScrollAnimationInterface | undefined,
    config: ScreenChromeConfigInterface,
    colorScheme: ColorSchemeEnum
): EdgeFadeIntensityConfigInterface => {
    const resolvedIntensity = isDefined(intensity) ? intensity : config.intensity;
    const scrollMaxIntensity = scrollAnimation?.maxIntensity;
    const resolvedMaxIntensity = isDefined(scrollMaxIntensity) ? scrollMaxIntensity : config.maxBlurIntensity;
    const blurIntensityScale = config.blurIntensityScale[colorScheme];

    return {
        opacityInputRange: scrollAnimation?.opacityInputRange,
        intensityInputRange: scrollAnimation?.intensityInputRange,
        scaledIntensity: resolvedIntensity * blurIntensityScale,
        scaledMaxIntensity: resolvedMaxIntensity * blurIntensityScale
    };
};
