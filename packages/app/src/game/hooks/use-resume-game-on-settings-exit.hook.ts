import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { gameResumeAction } from '../store/game.actions';
import { gameIsStartedSelector, gamePausedSelector, gameShouldResumeOnFocusSelector } from '../store/game.selectors';

export const useResumeGameOnSettingsExit = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const hasStarted = useAppSelector(gameIsStartedSelector);
    const isPaused = useAppSelector(gamePausedSelector);
    const shouldResumeOnExit = useAppSelector(gameShouldResumeOnFocusSelector);

    useEffect(
        () =>
            navigation.addListener('beforeRemove', () => {
                if (hasStarted && isPaused && shouldResumeOnExit) {
                    dispatch(gameResumeAction());
                }
            }),
        [dispatch, hasStarted, isPaused, navigation, shouldResumeOnExit]
    );
};
