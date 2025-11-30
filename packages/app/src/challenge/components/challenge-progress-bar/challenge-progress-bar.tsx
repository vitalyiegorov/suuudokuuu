import { use, useEffect, useMemo, useState } from 'react';
import { Animated, View } from 'react-native';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameElapsedTimeSelector, gameOpponentStepsSelector, gameOpponentTotalTimeSelector } from '../../../game/store/game.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { calculateOpponentProgress } from '../../utils/calculate-opponent-progress.util';
import { getStepIndicators } from '../../utils/get-step-indicators.util';

import { ChallengeProgressBarStyles as styles } from './challenge-progress-bar.styles';

import type { SolutionStepInterface } from '../../../history/interfaces/solution-step.interface';
import type { StyleProp, ViewStyle } from 'react-native';

const usePulseAnimation = (
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
                Animated.timing(pulseAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true })
            ]).start();
        }
    }, [elapsedTime, opponentProgress, opponentSteps, pulseAnim]);
};

const useProgressAnimation = (opponentProgress: number, progressAnim: Animated.Value): void => {
    useEffect(() => {
        Animated.timing(progressAnim, { toValue: opponentProgress, duration: 300, useNativeDriver: false }).start();
    }, [opponentProgress, progressAnim]);
};

// eslint-disable-next-line max-statements
export const ChallengeProgressBar = () => {
    const { theme } = use(ThemeContext);

    const elapsedTime = useAppSelector(gameElapsedTimeSelector);
    const opponentSteps = useAppSelector(gameOpponentStepsSelector);
    const opponentTotalTime = useAppSelector(gameOpponentTotalTimeSelector);

    const [progressAnim] = useState(() => new Animated.Value(0));
    const [pulseAnim] = useState(() => new Animated.Value(1));

    const opponentProgress = useMemo(() => calculateOpponentProgress(opponentSteps, elapsedTime), [opponentSteps, elapsedTime]);
    const stepIndicators = useMemo(() => getStepIndicators(opponentSteps, opponentTotalTime), [opponentSteps, opponentTotalTime]);
    const playerProgress = opponentTotalTime > 0 ? Math.min((elapsedTime / opponentTotalTime) * 100, 100) : 0;

    useProgressAnimation(opponentProgress, progressAnim);
    usePulseAnimation(opponentProgress, opponentSteps, elapsedTime, pulseAnim);

    const progressWidth = progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
    const trackStyle: StyleProp<ViewStyle> = [styles.track, { backgroundColor: theme.colors.black05 }];
    const playerProgressStyle: StyleProp<ViewStyle> = [
        styles.playerProgress,
        { width: `${playerProgress}%`, backgroundColor: theme.colors.blue }
    ];
    const opponentProgressStyle = [
        styles.opponentProgress,
        { width: progressWidth, backgroundColor: theme.colors.red, transform: [{ scaleY: pulseAnim }] }
    ];

    const getStepIndicatorStyle = (position: number): StyleProp<ViewStyle> => [
        styles.stepIndicator,
        { left: `${position}%`, backgroundColor: position <= opponentProgress ? theme.colors.red : theme.colors.white05 }
    ];

    return (
        <View style={styles.container}>
            <View style={trackStyle}>
                <Animated.View style={opponentProgressStyle} />
                <View style={playerProgressStyle} />
                {stepIndicators.map((position, index) => (
                    <View key={`step-${index}`} style={getStepIndicatorStyle(position)} />
                ))}
            </View>
        </View>
    );
};
