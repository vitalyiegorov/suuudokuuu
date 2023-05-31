import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus, Text, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { useAppDispatch, useAppSelector } from '../../../@generic';
import { gamePauseAction } from '../../store/game.actions';
import { gameElapsedTimeSelector, gamePausedSelector } from '../../store/game.selectors';

import { GameTimerStyles as styles } from './game-timer.styles';

const getElapsedTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
};

export const GameTimer = () => {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const savedTime = useAppSelector(gameElapsedTimeSelector);
    const paused = useAppSelector(gamePausedSelector);

    const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>();
    const [timerValue, setTimerValue] = useState(savedTime);

    // HINT: We should start timer only when we are on this screen
    useFocusEffect(
        useCallback(() => {
            if (!paused) {
                const startTime = Date.now();
                timerIntervalRef.current = setInterval(() => {
                    setTimerValue(() => savedTime + Math.floor((Date.now() - startTime) / 1000));
                }, 1000);
            }
        }, [paused, savedTime])
    );
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (nextAppState !== 'active') {
                dispatch(gamePauseAction(timerValue));
                router.push('pause');

                if (isDefined(timerIntervalRef.current)) {
                    clearInterval(timerIntervalRef.current);
                    timerIntervalRef.current = null;
                }
            }
        });

        return () => void subscription.remove();
    }, [dispatch, router, savedTime, timerValue]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>({getElapsedTime(timerValue)})</Text>
        </View>
    );
};
