import { type NativeStackNavigationProp, useNavigation } from 'expo-router';
import { useEffect } from 'react';

import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { gameResumeAction } from '../store/game.actions';
import { gameIsStartedSelector, gamePausedSelector, gameShouldResumeOnFocusSelector } from '../store/game.selectors';

type SettingsNavigationParamList = {
    'game-settings': undefined;
};

export const useResumeGameOnSettingsExit = () => {
    const navigation = useNavigation<NativeStackNavigationProp<SettingsNavigationParamList, 'game-settings'>>();
    const dispatch = useAppDispatch();
    const hasStarted = useAppSelector(gameIsStartedSelector);
    const isPaused = useAppSelector(gamePausedSelector);
    const shouldResumeOnExit = useAppSelector(gameShouldResumeOnFocusSelector);

    useEffect(
        () =>
            navigation.addListener('transitionEnd', ({ data }) => {
                if (data.closing && hasStarted && isPaused && shouldResumeOnExit) {
                    dispatch(gameResumeAction());
                }
            }),
        [dispatch, hasStarted, isPaused, navigation, shouldResumeOnExit]
    );
};
