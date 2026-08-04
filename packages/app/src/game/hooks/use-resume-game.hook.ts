import { usePathname, useRouter } from 'expo-router';

import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { gameResumeAction } from '../store/game.actions';
import { gameResumeGetNavigationIntent } from '../utils/game-resume-get-navigation-intent.util';

import type { OnEventFn } from '@rnw-community/shared';

export const useResumeGame = (): OnEventFn => {
    const pathname = usePathname();
    const router = useRouter();

    const dispatch = useAppDispatch();

    return () => {
        const navigationIntent = gameResumeGetNavigationIntent(pathname);

        dispatch(gameResumeAction());

        if (navigationIntent === 'replace') {
            router.replace('/game');
        }
    };
};
