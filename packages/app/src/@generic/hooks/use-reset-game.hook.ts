import { useEffect, useRef } from 'react';

import { gameResetAction } from '../../game/store/game.actions';
import { gameElapsedTimeSelector, gameIsStartedSelector, gameScoreSelector } from '../../game/store/game.selectors';

import { useAppDispatch } from './use-app-dispatch.hook';
import { useAppSelector } from './use-app-selector.hook';

export const useResetGame = () => {
    const dispatch = useAppDispatch();

    const isGameStarted = useAppSelector(gameIsStartedSelector);
    const score = useAppSelector(gameScoreSelector);
    const elapsedTime = useAppSelector(gameElapsedTimeSelector);
    const memoizedData = useRef({ score, elapsedTime });

    useEffect(() => void dispatch(gameResetAction()), [dispatch]);

    // eslint-disable-next-line react-hooks/refs
    return [isGameStarted, memoizedData.current.score, memoizedData.current.elapsedTime] as const;
};
