import { useEffect, useRef } from 'react';

import { gameResetAction } from '../../game/store/game.actions';
import { gameIsStartedSelector, gameSelector } from '../../game/store/game.selectors';
import { GameState } from '../../game/store/game.state';

import { useAppDispatch } from './use-app-dispatch.hook';
import { useAppSelector } from './use-app-selector.hook';

export const useResetGame = (): [isGameStarted: boolean, gameState: GameState] => {
    const dispatch = useAppDispatch();

    const gameState = useAppSelector(gameSelector);
    const isGameStarted = useAppSelector(gameIsStartedSelector);
    const memoizedData = useRef({ ...gameState });

    useEffect(() => void dispatch(gameResetAction()), [dispatch]);

    // eslint-disable-next-line react-hooks/refs
    return [isGameStarted, memoizedData.current] as const;
};
