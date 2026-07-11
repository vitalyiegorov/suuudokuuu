import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

import { appRootStore } from '../../@generic/app-root.store';
import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { gameResumeAction } from '../store/game.actions';
import { gameIsStartedSelector, gamePausedSelector, gameShouldResumeOnFocusSelector } from '../store/game.selectors';

export const useResumeGameOnFocus = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    useEffect(
        () =>
            navigation.addListener('focus', () => {
                const state = appRootStore.getState();
                const hasStarted = gameIsStartedSelector(state);
                const isPaused = gamePausedSelector(state);
                const shouldResume = gameShouldResumeOnFocusSelector(state);

                if (hasStarted && isPaused && shouldResume) {
                    dispatch(gameResumeAction());
                }
            }),
        [dispatch, navigation]
    );
};
