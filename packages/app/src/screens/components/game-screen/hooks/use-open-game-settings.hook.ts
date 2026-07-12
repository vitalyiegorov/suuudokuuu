import { useRouter } from 'expo-router';

import { useAppDispatch } from '../../../../@generic/hooks/use-app-dispatch.hook';
import { gamePauseAction } from '../../../../game/store/game.actions';
import { gameScreenOpenSettings } from '../utils/game-screen-open-settings.util';

import type { OnEventFn } from '@rnw-community/shared';

export const useOpenGameSettings = (): OnEventFn => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    return () =>
        void gameScreenOpenSettings(
            () => dispatch(gamePauseAction({ shouldShowPauseScreen: false })),
            href => void router.push(href)
        );
};
