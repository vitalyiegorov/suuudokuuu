import { use, useMemo, useState } from 'react';
import { Animated, View } from 'react-native';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameChallengeStepsSelector, gameChallengeTimeSelector, gameElapsedTimeSelector } from '../../../game/store/game.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { useProgressAnimation } from '../../hooks/use-progress-animation.hook';
import { usePulseAnimation } from '../../hooks/use-pulse-animation.hook';
import { calculateOpponentProgress } from '../../utils/calculate-opponent-progress.util';
import { getStepIndicators } from '../../utils/get-step-indicators.util';

import { ChallengeProgressBarStyles as styles } from './challenge-progress-bar.styles';

import type { StyleProp, ViewStyle } from 'react-native';

export const ChallengeProgressBar = () => {
    const { theme } = use(ThemeContext);

    const elapsedTime = useAppSelector(gameElapsedTimeSelector);
    const challengeSteps = useAppSelector(gameChallengeStepsSelector);
    const challengeTime = useAppSelector(gameChallengeTimeSelector);

    const [progressAnim] = useState(() => new Animated.Value(0));
    const [pulseAnim] = useState(() => new Animated.Value(1));

    const opponentProgress = useMemo(() => calculateOpponentProgress(challengeSteps, elapsedTime), [challengeSteps, elapsedTime]);
    const stepIndicators = useMemo(() => getStepIndicators(challengeSteps, challengeTime), [challengeSteps, challengeTime]);
    const playerProgress = challengeTime > 0 ? Math.min((elapsedTime / challengeTime) * 100, 100) : 0;

    useProgressAnimation(opponentProgress, progressAnim);
    usePulseAnimation(opponentProgress, challengeSteps, elapsedTime, pulseAnim);

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
