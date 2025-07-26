import { useRouter } from 'expo-router';

import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { gameResumeAction } from '../store/game.actions';

import type { OnEventFn } from '@rnw-community/shared';

export const useResumeGame = (): OnEventFn => {
    const router = useRouter();

    const dispatch = useAppDispatch();

    return () => {
        dispatch(gameResumeAction());
        router.push(`game`);
    };
};
