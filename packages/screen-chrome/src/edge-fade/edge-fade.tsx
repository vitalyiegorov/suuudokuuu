import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Platform, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isDefined } from '@rnw-community/shared';

import { ColorSchemeEnum } from '../enum/color-scheme.enum';
import { useScreenChrome } from '../hook/use-screen-chrome.hook';
import { EdgeFadePosition, ScreenChromeConfigInterface } from '../interface/screen-chrome-config.interface';

import { edgeFadeStyles } from './edge-fade.styles';
import { useEdgeFadeBlurProps } from './hook/use-edge-fade-blur-props.hook';
import { useEdgeFadeOpacityStyle } from './hook/use-edge-fade-opacity-style.hook';
import { EdgeFadePropsInterface } from './interface/edge-fade-props.interface';
import { getEdgeFadeBandMetrics } from './utils/edge-fade-get-band-metrics.util';
import { getEdgeFadeMaskStops } from './utils/edge-fade-get-mask-stops.util';
import { getBlurTint } from './utils/get-blur-tint.util';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const GRADIENT_START = { x: 0, y: 0 };
const GRADIENT_END = { x: 0, y: 1 };

const toGradientTuple = <T,>(items: readonly T[]): readonly [T, T, ...T[]] => [items[0], items[1], ...items.slice(2)];

const getEdgeFadeVisuals = (position: EdgeFadePosition, colorScheme: ColorSchemeEnum, config: ScreenChromeConfigInterface) => {
    const colorSet = config.colors[colorScheme];
    const washColors =
        position === 'top' ? toGradientTuple([colorSet.solid, colorSet.wash]) : toGradientTuple([colorSet.wash, colorSet.solid]);

    return {
        washColors,
        maskGradient: getEdgeFadeMaskStops(config.maskStops, position),
        tint: getBlurTint(colorScheme, Platform.OS === 'ios')
    };
};
export const EdgeFade = ({
    position,
    height,
    intensity,
    scrollAnimation,
    blurMethod = 'dimezisBlurView',
    style
}: EdgeFadePropsInterface): ReactNode => {
    const { config, colorScheme } = useScreenChrome();
    const insets = useSafeAreaInsets();

    const resolvedIntensity = isDefined(intensity) ? intensity : config.intensity;
    const { washColors, maskGradient, tint } = getEdgeFadeVisuals(position, colorScheme, config);

    const opacityInputRange = scrollAnimation?.opacityInputRange;
    const intensityInputRange = scrollAnimation?.intensityInputRange;
    const scrollMaxIntensity = scrollAnimation?.maxIntensity;
    const resolvedMaxIntensity = isDefined(scrollMaxIntensity) ? scrollMaxIntensity : config.maxBlurIntensity;

    const containerAnimatedStyle = useEdgeFadeOpacityStyle(opacityInputRange);
    const animatedBlurProps = useEdgeFadeBlurProps(intensityInputRange, resolvedMaxIntensity, resolvedIntensity);

    const positionalStyle = getEdgeFadeBandMetrics(position, height, config, insets);
    const bandStyle = [edgeFadeStyles.band, positionalStyle, containerAnimatedStyle, style];
    const blurIntensityProps = isDefined(scrollAnimation) ? { animatedProps: animatedBlurProps } : { intensity: resolvedIntensity };

    return (
        <Animated.View
            pointerEvents="none"
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={bandStyle}
        >
            <MaskedView
                style={edgeFadeStyles.fill}
                maskElement={
                    <LinearGradient
                        colors={toGradientTuple(maskGradient.colors)}
                        locations={toGradientTuple(maskGradient.locations)}
                        start={GRADIENT_START}
                        end={GRADIENT_END}
                        style={edgeFadeStyles.fill}
                    />
                }
            >
                <LinearGradient colors={washColors} start={GRADIENT_START} end={GRADIENT_END} style={edgeFadeStyles.fill} />
                <AnimatedBlurView style={StyleSheet.absoluteFill} tint={tint} blurMethod={blurMethod} {...blurIntensityProps} />
            </MaskedView>
        </Animated.View>
    );
};
