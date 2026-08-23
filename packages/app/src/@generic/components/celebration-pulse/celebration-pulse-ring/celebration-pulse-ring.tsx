import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { useEffect } from 'react';
import Animated, {
    Easing,
    cancelAnimation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

import { CelebrationPulseStyles as styles } from '../celebration-pulse.styles';
import { CelebrationPulseRepeatCount } from '../constant/celebration-pulse.constant';

import type { SharedValue } from 'react-native-reanimated';

const RingPulseDurationMs = 1500;
const UnitInput = [0, 1];

interface Props {
    readonly colorValue: SharedValue<string>;
    readonly delayMs: number;
    readonly opacityOutput: readonly [number, number];
    readonly scaleOutput: readonly [number, number];
    readonly size: number;
}

export const CelebrationPulseRing = ({ colorValue, delayMs, opacityOutput, scaleOutput, size }: Props) => {
    const pulse = useSharedValue(0);

    useEffect(() => {
        pulse.value = withDelay(
            delayMs,
            withRepeat(
                withTiming(1, { duration: RingPulseDurationMs, easing: Easing.out(Easing.ease) }),
                CelebrationPulseRepeatCount,
                false
            )
        );

        return () => void cancelAnimation(pulse);
    }, [delayMs, pulse]);

    const ringAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: colorValue.value,
        opacity: interpolate(pulse.value, UnitInput, opacityOutput),
        transform: [{ scale: interpolate(pulse.value, UnitInput, scaleOutput) }]
    }));
    const ringStyle = [resolveUnistyleForAnimated(styles.ring), { height: size, width: size }, ringAnimatedStyle];

    return <Animated.View style={ringStyle} />;
};
