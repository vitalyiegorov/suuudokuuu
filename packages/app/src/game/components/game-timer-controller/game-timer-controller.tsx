import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { AppState } from 'react-native';

import { appRootStore } from '../../../@generic/app-root.store';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { gamePauseAction, gameResumeAction, gameTickAction } from '../../store/game.actions';
import { gameIsStartedSelector, gamePausedSelector, gameShouldResumeOnFocusSelector } from '../../store/game.selectors';
import { gameTimerStopTimer } from '../../utils/game-timer-stop-timer.util';

type SetIntervalRef = ReturnType<typeof setInterval> | null;

export const GameTimerController = () => {
    const { replace } = useRouter();
    const dispatch = useAppDispatch();
    const hasHandledBackgroundRef = useRef(false);
    const timerIntervalRef = useRef<SetIntervalRef>(null);

    useFocusEffect(
        useCallback(() => {
            const state = appRootStore.getState();
            const hasStarted = gameIsStartedSelector(state);
            const isPaused = gamePausedSelector(state);
            const shouldResumeOnFocus = gameShouldResumeOnFocusSelector(state);
            const shouldResumeTimerOnFocus = hasStarted && isPaused && shouldResumeOnFocus;
            const shouldRunTimer = hasStarted && (!isPaused || shouldResumeTimerOnFocus);

            hasHandledBackgroundRef.current = false;
            gameTimerStopTimer(timerIntervalRef);

            if (shouldResumeTimerOnFocus) {
                dispatch(gameResumeAction());
            }

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
        }, [dispatch, replace])
    );

    return null;
};
