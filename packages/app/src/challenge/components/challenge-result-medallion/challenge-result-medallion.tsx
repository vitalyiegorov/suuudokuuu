import { LucideFlag, LucideHeartCrack, LucideTrophy } from 'lucide-react-native';
import { use, useEffect } from 'react';
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

import { resolveUnistyleForAnimated } from '../../../@generic/utils/resolve-unistyle-for-animated.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeResult } from '../../interfaces/challenge-result.interface';

import { ChallengeResultMedallionStyles as styles } from './challenge-result-medallion.styles';

const PULSE_DURATION_MS = 1500;
const PULSE_INPUT = [0, 1];
const RING_OPACITY_OUTPUT = [0.5, 0];
const RING_SCALE_OUTPUT = [0.7, 1.8];
const MEDAL_SCALE_OUTPUT = [0.5, 1];
const MEDAL_PULSE_PEAK = 1 + 0.05;
const MEDAL_PULSE_INPUT = [0, 0.5, 1];
const MEDAL_PULSE_OUTPUT = [1, MEDAL_PULSE_PEAK, 1];
const ICON_SIZE = 42;

interface Props {
    readonly result: ChallengeResult;
}

export const ChallengeResultMedallion = ({ result }: Props) => {
    const { theme } = use(ThemeContext);

    const pulse = useSharedValue(0);
    const appear = useSharedValue(0);

    const showRing = result === ChallengeResult.Won;

    useEffect(() => {
        appear.value = withSpring(1, { damping: 12, stiffness: 160 });
    }, [appear]);
    useEffect(() => {
        if (showRing) {
            pulse.value = withRepeat(withTiming(1, { duration: PULSE_DURATION_MS, easing: Easing.out(Easing.ease) }), -1, false);
        }
    }, [pulse, showRing]);

    const medalScale = useDerivedValue(() => interpolate(appear.value, PULSE_INPUT, MEDAL_SCALE_OUTPUT));
    const medalAnimatedStyle = useAnimatedStyle(() => {
        const pulseScale = showRing ? interpolate(pulse.value, MEDAL_PULSE_INPUT, MEDAL_PULSE_OUTPUT) : 1;

        return { transform: [{ scale: medalScale.value * pulseScale }] };
    });
    const ringAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(pulse.value, PULSE_INPUT, RING_OPACITY_OUTPUT),
        transform: [{ scale: interpolate(pulse.value, PULSE_INPUT, RING_SCALE_OUTPUT) }]
    }));

    let Icon = LucideFlag;
    let iconColor = theme.colors.label.inverted;
    if (result === ChallengeResult.Won) {
        Icon = LucideTrophy;
    }
    if (result === ChallengeResult.Lost) {
        Icon = LucideHeartCrack;
        iconColor = theme.colors.red;
    }

    const ringStyle = [resolveUnistyleForAnimated(styles.ring), { backgroundColor: theme.colors.black }, ringAnimatedStyle];
    const medalStyle = [resolveUnistyleForAnimated(styles.medal), { backgroundColor: theme.colors.black }, medalAnimatedStyle];

    return (
        <View style={styles.wrap}>
            {showRing ? <Animated.View style={ringStyle} /> : null}
            <Animated.View style={medalStyle}>
                <Icon color={iconColor} size={ICON_SIZE} strokeWidth={1.8} />
            </Animated.View>
        </View>
    );
};
