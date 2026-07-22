import { useEffect } from 'react';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { ChallengeRaceAccent, ChallengeRaceSurface } from '../../constants/challenge-race-palette.constant';

import { ChallengeRaceRunnerStyles as styles } from './challenge-race-runner.styles';

import type { SharedValue } from 'react-native-reanimated';

const PULSE_DURATION_MS = 900;
const PULSE_INPUT = [0, 1];
const PROGRESS_OUTPUT = [0, 100];
const HALO_OPACITY_OUTPUT = [0.5, 0];
const HALO_SCALE_OUTPUT = [0.7, 1.8];

interface Props {
    readonly progress: SharedValue<number>;
}

export const ChallengeRaceRunner = ({ progress }: Props) => {
    const pulse = useSharedValue(0);

    useEffect(() => {
        pulse.value = withRepeat(withTiming(1, { duration: PULSE_DURATION_MS, easing: Easing.inOut(Easing.ease) }), -1, true);
    }, [pulse]);

    const runnerAnimatedStyle = useAnimatedStyle(() => ({
        left: `${interpolate(progress.value, PULSE_INPUT, PROGRESS_OUTPUT)}%`
    }));
    const haloAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(pulse.value, PULSE_INPUT, HALO_OPACITY_OUTPUT),
        transform: [{ scale: interpolate(pulse.value, PULSE_INPUT, HALO_SCALE_OUTPUT) }]
    }));

    const runnerStyle = [styles.runner, runnerAnimatedStyle];
    const haloStyle = [styles.halo, { backgroundColor: ChallengeRaceAccent }, haloAnimatedStyle];
    const coreStyle = [styles.core, { backgroundColor: ChallengeRaceAccent, borderColor: ChallengeRaceSurface }];

    return (
        <Animated.View pointerEvents="none" style={runnerStyle}>
            <Animated.View style={haloStyle} />
            <Animated.View style={coreStyle} />
        </Animated.View>
    );
};
