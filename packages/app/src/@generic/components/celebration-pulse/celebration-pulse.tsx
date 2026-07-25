import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming
} from 'react-native-reanimated';

import { resolveUnistyleForAnimated } from '../../utils/resolve-unistyle-for-animated.util';

import { CelebrationPulseStyles as styles } from './celebration-pulse.styles';

import type { ReactNode } from 'react';

const PulseDurationMs = 1500;
const UnitInput = [0, 1];
const AppearScaleOutput = [0.5, 1];
const RingOpacityOutput = [0.5, 0];
const RingScaleOutput = [0.7, 1.8];
const ContentPulsePeak = 1.05;
const ContentPulseInput = [0, 0.5, 1];
const ContentPulseOutput = [1, ContentPulsePeak, 1];

interface Props {
    readonly children: ReactNode;
    readonly color: string;
    readonly size: number;
}

export const CelebrationPulse = ({ children, color, size }: Props) => {
    const pulse = useSharedValue(0);
    const appear = useSharedValue(0);

    useEffect(() => {
        appear.value = withSpring(1, { damping: 12, stiffness: 160 });
    }, [appear]);
    useEffect(() => {
        pulse.value = withRepeat(withTiming(1, { duration: PulseDurationMs, easing: Easing.out(Easing.ease) }), -1, false);
    }, [pulse]);

    const appearScale = useDerivedValue(() => interpolate(appear.value, UnitInput, AppearScaleOutput));
    const contentAnimatedStyle = useAnimatedStyle(() => {
        const pulseScale = interpolate(pulse.value, ContentPulseInput, ContentPulseOutput);

        return { transform: [{ scale: appearScale.value * pulseScale }] };
    });
    const ringAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(pulse.value, UnitInput, RingOpacityOutput),
        transform: [{ scale: interpolate(pulse.value, UnitInput, RingScaleOutput) }]
    }));

    const wrapStyle = [styles.wrap, { height: size, width: size }];
    const ringStyle = [resolveUnistyleForAnimated(styles.ring), { backgroundColor: color, height: size, width: size }, ringAnimatedStyle];
    const contentStyle = [resolveUnistyleForAnimated(styles.content), contentAnimatedStyle];

    return (
        <View style={wrapStyle}>
            <Animated.View style={ringStyle} />
            <Animated.View style={contentStyle}>{children}</Animated.View>
        </View>
    );
};
