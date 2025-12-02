import { use, useEffect, useState } from 'react';
import { Animated, View } from 'react-native';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameChallengeStepsSelector, gameChallengeTimeSelector, gameElapsedTimeSelector } from '../../../game/store/game.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { calculateOpponentProgress } from '../../utils/calculate-opponent-progress.util';
import { getStepIndicators } from '../../utils/get-step-indicators.util';

import { ChallengeProgressBarStyles as styles } from './challenge-progress-bar.styles';

import type { StyleProp, ViewStyle } from 'react-native';

const PULSE_SCALE = 1.2;
const PULSE_DURATION_MS = 150;
const ANIMATION_DURATION_MS = 300;

export const ChallengeProgressBar = () => {
    const { theme } = use(ThemeContext);

    const elapsedTime = useAppSelector(gameElapsedTimeSelector);
    const challengeSteps = useAppSelector(gameChallengeStepsSelector);
    const challengeTime = useAppSelector(gameChallengeTimeSelector);

    const [progressAnim] = useState(() => new Animated.Value(0));
    const [pulseAnim] = useState(() => new Animated.Value(1));

    const opponentProgress = calculateOpponentProgress(challengeSteps, elapsedTime);
    const stepIndicators = getStepIndicators(challengeSteps, challengeTime);
    const playerProgress = challengeTime > 0 ? Math.min((elapsedTime / challengeTime) * 100, 100) : 0;

    useEffect(() => {
        const prevStepCount = Math.floor((opponentProgress / 100) * challengeSteps.length);
        const currentStepCount = Math.floor((playerProgress / 100) * challengeSteps.length);

        if (currentStepCount > prevStepCount) {
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: PULSE_SCALE, duration: PULSE_DURATION_MS, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: PULSE_DURATION_MS, useNativeDriver: true })
            ]).start();
        }
    }, [playerProgress, challengeSteps.length, progressAnim, pulseAnim]);

    useEffect(() => {
        Animated.timing(progressAnim, { toValue: opponentProgress, duration: ANIMATION_DURATION_MS, useNativeDriver: false }).start();
    }, [opponentProgress]);

    const progressWidth = progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
    const trackStyle: StyleProp<ViewStyle> = [styles.track, { backgroundColor: theme.colors.black05 }];
    const playerProgressStyle: StyleProp<ViewStyle> = [
        styles.playerProgress,
        { width: `${playerProgress}%`, backgroundColor: theme.colors.blue }
    ];
    const opponentProgressStyle: StyleProp<ViewStyle> = [
        styles.opponentProgress,
        { width: progressWidth, backgroundColor: theme.colors.red }
    ];
    const pulseStyles = { transform: [{ scaleY: pulseAnim }], flex: 1 };

    const getStepIndicatorStyle = (position: number): StyleProp<ViewStyle> => [
        styles.stepIndicator,
        { left: `${position}%`, backgroundColor: position <= opponentProgress ? theme.colors.red : theme.colors.white05 }
    ];

    return (
        <View style={styles.container}>
            <View style={trackStyle}>
                <Animated.View style={opponentProgressStyle}>
                    <Animated.View style={pulseStyles} />
                </Animated.View>
                <View style={playerProgressStyle} />
                {stepIndicators.map((position, index) => (
                    <View key={`step-${index}`} style={getStepIndicatorStyle(position)} />
                ))}
            </View>
        </View>
    );
};
