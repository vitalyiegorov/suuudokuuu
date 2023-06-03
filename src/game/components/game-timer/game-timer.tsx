import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { getTimerText, useAppDispatch, useAppSelector, useAppStateChange } from '../../../@generic';
import { gamePauseAction, gameTickAction } from '../../store/game.actions';
import { gameElapsedTimeSelector, gameIsGameActiveSelector, gamePausedSelector } from '../../store/game.selectors';

import { GameTimerStyles as styles } from './game-timer.styles';

export const GameTimer = () => {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const savedTime = useAppSelector(gameElapsedTimeSelector);
    const paused = useAppSelector(gamePausedSelector);
    const isGameActive = useAppSelector(gameIsGameActiveSelector);

    const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>();

    const stopTimer = useCallback((): void => {
        if (isDefined(timerIntervalRef.current)) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    }, []);
    const routerScreenFocused = useCallback(() => {
        if (!paused) {
            timerIntervalRef.current = setInterval(() => void dispatch(gameTickAction()), 1000);
        }
    }, [dispatch, paused]);
    const appBecameInactive = useCallback((): void => {
        if (isGameActive) {
            stopTimer();
            dispatch(gamePauseAction());
            router.replace('pause');
        }
    }, [dispatch, isGameActive, router, stopTimer]);

    // HINT: We need to stop timer when game is finished
    useEffect(() => void (!isGameActive && void stopTimer()), [stopTimer, isGameActive]);
    // HINT: We should start timer only when we are on this screen and game is not paused
    useFocusEffect(routerScreenFocused);
    useAppStateChange(appBecameInactive);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>({getTimerText(savedTime)})</Text>
        </View>
    );
};
