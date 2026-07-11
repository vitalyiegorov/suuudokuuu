import { type NativeStackNavigationProp, useNavigation, useRoute } from 'expo-router';
import { useEffect } from 'react';

import { appRootStore } from '../../@generic/app-root.store';
import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { gameResumeAction } from '../store/game.actions';
import { gameIsStartedSelector, gamePausedSelector, gameShouldResumeOnFocusSelector } from '../store/game.selectors';

type GameSettingsNavigationParamList = {
    'game-settings': undefined;
};

export const useResumeGameOnSettingsClose = () => {
    const navigation = useNavigation<NativeStackNavigationProp<GameSettingsNavigationParamList, 'game-settings'>>();
    const route = useRoute();
    const dispatch = useAppDispatch();

    useEffect(
        () =>
            navigation.addListener('transitionStart', ({ data, target }) => {
                const state = appRootStore.getState();
                const hasStarted = gameIsStartedSelector(state);
                const isPaused = gamePausedSelector(state);
                const shouldResume = gameShouldResumeOnFocusSelector(state);
                const didCloseGameSettings = data.closing && target === route.key;

                if (didCloseGameSettings && hasStarted && isPaused && shouldResume) {
                    dispatch(gameResumeAction());
                }
            }),
        [dispatch, navigation, route.key]
    );
};
