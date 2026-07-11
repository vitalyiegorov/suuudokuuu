import { type NativeStackNavigationProp, useNavigation } from 'expo-router';
import { useEffect } from 'react';

import { appRootStore } from '../../@generic/app-root.store';
import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { gameResumeAction } from '../store/game.actions';
import { gameIsStartedSelector, gamePausedSelector, gameShouldResumeOnFocusSelector } from '../store/game.selectors';

type GameNavigationParamList = {
    game: undefined;
};

export const useResumeGameAfterTransition = () => {
    const navigation = useNavigation<NativeStackNavigationProp<GameNavigationParamList, 'game'>>();
    const dispatch = useAppDispatch();

    useEffect(
        () =>
            navigation.addListener('transitionEnd', ({ data }) => {
                const state = appRootStore.getState();
                const hasStarted = gameIsStartedSelector(state);
                const isPaused = gamePausedSelector(state);
                const shouldResume = gameShouldResumeOnFocusSelector(state);

                if (!data.closing && hasStarted && isPaused && shouldResume) {
                    dispatch(gameResumeAction());
                }
            }),
        [dispatch, navigation]
    );
};
