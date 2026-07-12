import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { appRootStore } from '../../@generic/app-root.store';
import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { gamePauseAction } from '../store/game.actions';
import { gameIsStartedSelector, gamePausedSelector } from '../store/game.selectors';

export const usePauseGameOnSettingsFocus = () => {
    const dispatch = useAppDispatch();

    useFocusEffect(
        useCallback(() => {
            const state = appRootStore.getState();
            const hasStarted = gameIsStartedSelector(state);
            const isPaused = gamePausedSelector(state);

            if (hasStarted && !isPaused) {
                dispatch(gamePauseAction({ shouldShowPauseScreen: false }));
            }
        }, [dispatch])
    );
};
