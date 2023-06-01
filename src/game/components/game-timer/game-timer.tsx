import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { useAppDispatch, useAppSelector, useAppStateChange } from '../../../@generic';
import { gamePauseAction } from '../../store/game.actions';
import { gameElapsedTimeSelector, gamePausedSelector } from '../../store/game.selectors';
import { getElapsedTime } from '../../utils/get-elapsed-time.util';
import { getTimerText } from '../../utils/get-timer-text.util';

import { GameTimerStyles as styles } from './game-timer.styles';

export const GameTimer = () => {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const savedTime = useAppSelector(gameElapsedTimeSelector);
    const paused = useAppSelector(gamePausedSelector);

    const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>();
    const [timerValue, setTimerValue] = useState(savedTime);

    const appBecameInactive = useCallback((): void => {
        // HINT: Stop timer
        if (isDefined(timerIntervalRef.current)) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }

        dispatch(gamePauseAction(timerValue));
        router.push('pause');
    }, [dispatch, router, timerValue]);
    const routerScreenFocus = useCallback(() => {
        // HINT: We should start timer only when we are on this screen and game is resumed
        if (!paused) {
            const startTime = Date.now();
            timerIntervalRef.current = setInterval(() => {
                setTimerValue(getElapsedTime(startTime));
            }, 1000);
        }
    }, [paused]);

    useFocusEffect(routerScreenFocus);
    useAppStateChange(appBecameInactive);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>({getTimerText(timerValue)})</Text>
        </View>
    );
};
