import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { AppState } from 'react-native';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gamePauseAction, gameTickAction } from '../../store/game.actions';
import { gameIsStartedSelector, gamePausedSelector } from '../../store/game.selectors';
import { gameTimerStopTimer } from '../../utils/game-timer-stop-timer.util';

type SetIntervalRef = ReturnType<typeof setInterval> | null;

export const GameTimerController = () => {
    const { replace } = useRouter();
    const dispatch = useAppDispatch();
    const hasStarted = useAppSelector(gameIsStartedSelector);
    const isPaused = useAppSelector(gamePausedSelector);
    const hasHandledBackgroundRef = useRef(false);
    const timerIntervalRef = useRef<SetIntervalRef>(null);

    useFocusEffect(
        useCallback(() => {
            const shouldRunTimer = hasStarted && !isPaused;

            hasHandledBackgroundRef.current = false;
            gameTimerStopTimer(timerIntervalRef);

            if (shouldRunTimer) {
                timerIntervalRef.current = setInterval(() => {
                    dispatch(gameTickAction());
                }, 1000);
            }

            const subscription = AppState.addEventListener('change', nextAppState => {
                if (nextAppState !== 'active' && shouldRunTimer && !hasHandledBackgroundRef.current) {
                    hasHandledBackgroundRef.current = true;
                    gameTimerStopTimer(timerIntervalRef);
                    dispatch(gamePauseAction());
                    replace('/pause');
                }
            });

            return () => {
                subscription.remove();
                gameTimerStopTimer(timerIntervalRef);
            };
        }, [dispatch, hasStarted, isPaused, replace])
    );

    return null;
};
