import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { getTimerText, useAppDispatch, useAppSelector, useAppStateChange } from '../../../@generic';
import { gamePauseAction, gameTickAction } from '../../store/game.actions';
import { gameElapsedTimeSelector, gamePausedSelector } from '../../store/game.selectors';

import { GameTimerStyles as styles } from './game-timer.styles';

type SetIntervalRef = ReturnType<typeof setInterval> | null;

export const GameTimer = () => {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const savedTime = useAppSelector(gameElapsedTimeSelector);
    const paused = useAppSelector(gamePausedSelector);

    const timerIntervalRef = useRef<SetIntervalRef>();

    const stopTimer = useCallback((): void => {
        if (isDefined(timerIntervalRef.current)) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    }, []);
    const startTimer = useCallback(() => {
        if (!paused) {
            stopTimer();
            timerIntervalRef.current = setInterval(() => {
                dispatch(gameTickAction());
            }, 1000);
        }
    }, [dispatch, paused, stopTimer]);
    const appBecameInactive = useCallback((): void => {
        stopTimer();
        dispatch(gamePauseAction());
        router.replace('pause');
    }, [dispatch, router, stopTimer]);

    useEffect(() => {
        startTimer();

        return () => void stopTimer();
    }, [startTimer, stopTimer]);
    useAppStateChange(appBecameInactive);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>({getTimerText(savedTime)})</Text>
        </View>
    );
};
