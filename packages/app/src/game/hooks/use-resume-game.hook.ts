import { useRouter } from 'expo-router';


import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { gameResumeAction } from '../store/game.actions';
import { gameSudokuStringSelector } from '../store/game.selectors';

import type { OnEventFn } from '@rnw-community/shared';

export const useResumeGame = (): OnEventFn => {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const oldGameString = useAppSelector(gameSudokuStringSelector);

    return () => {
        dispatch(gameResumeAction());
        router.push(`game?field=${oldGameString}`);
    };
};
