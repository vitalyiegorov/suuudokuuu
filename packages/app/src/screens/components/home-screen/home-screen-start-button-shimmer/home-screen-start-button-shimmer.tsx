import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    Easing,
    cancelAnimation,
    interpolate,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { useIridescentColor } from '../../../../@generic/hooks/use-iridescent-color.hook';

import { HomeScreenStartButtonShimmerSelectors } from './home-screen-start-button-shimmer.selectors';
import { HomeScreenStartButtonShimmerStyles as styles } from './home-screen-start-button-shimmer.styles';

import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

const ShimmerBreatheDurationMs = 2400;
const ShimmerOpacityMin = 0.08;
const ShimmerOpacityMax = 0.22;
const ShimmerOpacityOutput = [ShimmerOpacityMin, ShimmerOpacityMax];

interface Props {
    readonly children: ReactNode;
    readonly style: StyleProp<ViewStyle>;
}

export const HomeScreenStartButtonShimmer = ({ children, style }: Props) => {
    const { theme } = useUnistyles();
    const reduceMotion = useReducedMotion();
    const breathe = useSharedValue(0);
    const shimmerColor = useIridescentColor(theme, !reduceMotion);

    useEffect(() => {
        if (!reduceMotion) {
            breathe.value = withRepeat(withTiming(1, { duration: ShimmerBreatheDurationMs, easing: Easing.inOut(Easing.ease) }), -1, true);
        }

        return () => void cancelAnimation(breathe);
    }, [reduceMotion, breathe]);

    const shimmerAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: shimmerColor.value,
        opacity: interpolate(breathe.value, [0, 1], ShimmerOpacityOutput)
    }));
    const wrapperStyle = [resolveUnistyleForAnimated(StyleSheet.flatten(style)), resolveUnistyleForAnimated(styles.wrapper)];
    const shimmerStyle = [resolveUnistyleForAnimated(styles.shimmer), shimmerAnimatedStyle];

    return (
        <Animated.View style={wrapperStyle} testID={HomeScreenStartButtonShimmerSelectors.Wrapper}>
            {children}

            {reduceMotion ? null : (
                <Animated.View pointerEvents="none" style={shimmerStyle} testID={HomeScreenStartButtonShimmerSelectors.Root} />
            )}
        </Animated.View>
    );
};
