import { useRouter } from 'expo-router';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { useAppStateChange } from '../../../@generic/hooks/use-app-state-change.hook';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { gamePauseAction, gameTickAction } from '../../store/game.actions';
import { gameElapsedTimeSelector, gamePausedSelector } from '../../store/game.selectors';

import { GameTimerStyles as styles } from './game-timer.styles';

type SetIntervalRef = ReturnType<typeof setInterval> | null;

const stopTimer = (timerIntervalRef: RefObject<SetIntervalRef | undefined>): void => {
    if (isDefined(timerIntervalRef.current)) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
    }
};

export const GameTimer = () => {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const savedTime = useAppSelector(gameElapsedTimeSelector);
    const paused = useAppSelector(gamePausedSelector);

    const timerIntervalRef = useRef<SetIntervalRef>(null);

    useEffect(() => {
        if (!paused) {
            stopTimer(timerIntervalRef);
            timerIntervalRef.current = setInterval(() => {
                dispatch(gameTickAction());
            }, 1000);
        }

        return () => void stopTimer(timerIntervalRef);
    }, [dispatch, paused]);

    useAppStateChange(() => {
        stopTimer(timerIntervalRef);
        dispatch(gamePauseAction());
        router.replace('pause');
    });

    return (
        <View style={styles.container}>
            <Text style={styles.text}>({getTimerText(savedTime)})</Text>
        </View>
    );
};
