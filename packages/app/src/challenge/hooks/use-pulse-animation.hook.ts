import { useEffect } from 'react';
import { Animated } from 'react-native';

import { calculateOpponentProgress } from '../utils/calculate-opponent-progress.util';

import type { SolutionStepInterface } from '../../history/interfaces/solution-step.interface';

const PULSE_SCALE = 1.2;
const PULSE_DURATION_MS = 150;

export const usePulseAnimation = (
    opponentProgress: number,
    opponentSteps: SolutionStepInterface[],
    elapsedTime: number,
    pulseAnim: Animated.Value
): void => {
    useEffect(() => {
        const prevStepCount = Math.floor((opponentProgress / 100) * opponentSteps.length);
        const currentProgress = calculateOpponentProgress(opponentSteps, elapsedTime);
        const currentStepCount = Math.floor((currentProgress / 100) * opponentSteps.length);

        if (currentStepCount > prevStepCount) {
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: PULSE_SCALE, duration: PULSE_DURATION_MS, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: PULSE_DURATION_MS, useNativeDriver: true })
            ]).start();
        }
    }, [elapsedTime, opponentProgress, opponentSteps, pulseAnim]);
};
