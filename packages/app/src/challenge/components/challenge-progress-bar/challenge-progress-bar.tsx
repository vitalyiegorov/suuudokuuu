import { router } from 'expo-router';
import { use, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { resolveUnistyleForAnimated } from '../../../@generic/utils/resolve-unistyle-for-animated.util';
import { GameContext } from '../../../game/context/game.context';
import { gameFinishAction } from '../../../game/store/game.actions';
import {
    gameChallengeStepsSelector,
    gameChallengeTimeSelector,
    gameElapsedTimeSelector,
    gameSolutionsStepsSelector
} from '../../../game/store/game.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { getChallengeProgress } from '../../utils/get-challenge-progress.util';

import { ChallengeProgressBarStyles as styles } from './challenge-progress-bar.styles';

import type { StyleProp, ViewStyle } from 'react-native';

const ANIMATION_DURATION_MS = 300;

export const ChallengeProgressBar = () => {
    const { theme } = use(ThemeContext);
    const { sudoku } = use(GameContext);

    const dispatch = useAppDispatch();
    const elapsedTime = useAppSelector(gameElapsedTimeSelector);
    const challengeSteps = useAppSelector(gameChallengeStepsSelector);
    const challengeTime = useAppSelector(gameChallengeTimeSelector);
    const playerSteps = useAppSelector(gameSolutionsStepsSelector);

    const challengeProgressValue = useSharedValue(0);
    const playerProgressValue = useSharedValue(0);

    const [stepIndicators, opponentProgress] = getChallengeProgress(challengeSteps, challengeTime, elapsedTime);
    const playerProgress = playerSteps.length / challengeSteps.length;

    useEffect(() => {
        challengeProgressValue.value = withTiming(opponentProgress, { duration: ANIMATION_DURATION_MS });
    }, [opponentProgress, challengeProgressValue]);
    useEffect(() => {
        playerProgressValue.value = withTiming(playerProgress, { duration: ANIMATION_DURATION_MS });
    }, [playerProgressValue, playerProgress]);
    useEffect(() => {
        if (opponentProgress >= 1) {
            dispatch(gameFinishAction({ difficulty: sudoku.Difficulty, isWon: false, isChallenge: true }));
            router.replace('/challenge-lost');
        }
    }, [opponentProgress, dispatch, sudoku.Difficulty]);

    const opponentProgressAnimatedStyle = useAnimatedStyle(() => ({
        width: `${interpolate(challengeProgressValue.value, [0, 1], [0, 100])}%`
    }));
    const playerProgressAnimatedStyle = useAnimatedStyle(() => ({
        width: `${interpolate(playerProgressValue.value, [0, 1], [0, 100])}%`
    }));

    const trackStyle: StyleProp<ViewStyle> = [styles.track, { backgroundColor: theme.colors.black05 }];
    const playerProgressStyle = [
        resolveUnistyleForAnimated(styles.playerProgress),
        { backgroundColor: theme.colors.black },
        playerProgressAnimatedStyle
    ];
    const opponentProgressStyle = [
        resolveUnistyleForAnimated(styles.opponentProgress),
        { backgroundColor: theme.colors.red },
        opponentProgressAnimatedStyle
    ];

    const getStepIndicatorStyle = (position: number): StyleProp<ViewStyle> => [
        styles.stepIndicator,
        { left: `${position}%`, backgroundColor: theme.colors.red }
    ];

    return (
        <View style={styles.container}>
            <View style={trackStyle}>
                <Animated.View style={opponentProgressStyle} />
                <Animated.View style={playerProgressStyle} />
                {stepIndicators.map((position, index) => (
                    <View key={`step-${index}`} style={getStepIndicatorStyle(position)} />
                ))}
            </View>
        </View>
    );
};
