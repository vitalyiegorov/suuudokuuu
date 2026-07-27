import { AppState } from 'react-native';

import { appRootStore } from '../../@generic/app-root.store';
import {
    gameChallengeClockSyncAction,
    gamePauseAction,
    gameResumeAction,
    gameTickAction,
    gameTimelineAwayAction,
    gameTimelineReturnAction
} from '../store/game.actions';
import {
    gameIsChallengeRunSelector,
    gameIsStartedSelector,
    gamePausedSelector,
    gameShouldResumeOnFocusSelector
} from '../store/game.selectors';

import { gameTimerStopTimer } from './game-timer-stop-timer.util';

import type { AppDispatch } from '../../@generic/app-root.store';
import type { RefObject } from 'react';

type SetIntervalRef = ReturnType<typeof setInterval> | null;

interface GameTimerFocusDependenciesInterface {
    readonly dispatch: AppDispatch;
    readonly replace: (href: '/pause') => void;
    readonly timerIntervalRef: RefObject<SetIntervalRef>;
    readonly hasHandledBackgroundRef: RefObject<boolean>;
}

const getGameTimerSnapshot = () => {
    const state = appRootStore.getState();
    const hasStarted = gameIsStartedSelector(state);
    const isPaused = gamePausedSelector(state);
    const isChallenge = gameIsChallengeRunSelector(state);
    const shouldResumeTimerOnFocus = hasStarted && isPaused && gameShouldResumeOnFocusSelector(state);
    const shouldRunTimer = hasStarted && (!isPaused || shouldResumeTimerOnFocus);

    return { hasStarted, isChallenge, shouldResumeTimerOnFocus, shouldRunTimer };
};

const createGameTimerAppStateListener = (
    dependencies: GameTimerFocusDependenciesInterface,
    snapshot: ReturnType<typeof getGameTimerSnapshot>,
    startTimer: () => void
) => {
    const { dispatch, replace, timerIntervalRef, hasHandledBackgroundRef } = dependencies;

    const handleChallengeAppState = (nextAppState: string) => {
        gameTimerStopTimer(timerIntervalRef);

        if (nextAppState === 'active') {
            dispatch(gameChallengeClockSyncAction({ nowMs: Date.now() }));
            dispatch(gameTimelineReturnAction());
            startTimer();
        } else {
            dispatch(gameTimelineAwayAction());
        }
    };

    return (nextAppState: string) => {
        if (!snapshot.shouldRunTimer) {
            return;
        }

        if (snapshot.isChallenge) {
            handleChallengeAppState(nextAppState);

            return;
        }

        if (nextAppState !== 'active' && !hasHandledBackgroundRef.current) {
            hasHandledBackgroundRef.current = true;
            gameTimerStopTimer(timerIntervalRef);
            dispatch(gamePauseAction());
            replace('/pause');
        }
    };
};

export const gameTimerRunFocusEffect = (dependencies: GameTimerFocusDependenciesInterface) => {
    const { dispatch, timerIntervalRef, hasHandledBackgroundRef } = dependencies;
    const snapshot = getGameTimerSnapshot();

    hasHandledBackgroundRef.current = false;
    gameTimerStopTimer(timerIntervalRef);

    if (snapshot.shouldResumeTimerOnFocus) {
        dispatch(gameResumeAction());
    }

    if (snapshot.isChallenge && snapshot.hasStarted) {
        dispatch(gameChallengeClockSyncAction({ nowMs: Date.now() }));
        dispatch(gameTimelineReturnAction());
    }

    const startTimer = () => {
        timerIntervalRef.current = setInterval(() => {
            dispatch(gameTickAction());
        }, 1000);
    };

    if (snapshot.shouldRunTimer) {
        startTimer();
    }

    const subscription = AppState.addEventListener('change', createGameTimerAppStateListener(dependencies, snapshot, startTimer));

    return () => {
        subscription.remove();
        gameTimerStopTimer(timerIntervalRef);
    };
};
