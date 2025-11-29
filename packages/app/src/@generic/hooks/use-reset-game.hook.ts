import { useEffect, useRef } from 'react';

import { gameResetAction } from '../../game/store/game.actions';
import {
    gameElapsedTimeSelector,
    gameIsChallengeModeSelector,
    gameIsStartedSelector,
    gameOpponentTotalTimeSelector,
    gameScoreSelector
} from '../../game/store/game.selectors';

import { useAppDispatch } from './use-app-dispatch.hook';
import { useAppSelector } from './use-app-selector.hook';

export const useResetGame = () => {
    const dispatch = useAppDispatch();

    const isGameStarted = useAppSelector(gameIsStartedSelector);
    const score = useAppSelector(gameScoreSelector);
    const elapsedTime = useAppSelector(gameElapsedTimeSelector);
    const isChallengeMode = useAppSelector(gameIsChallengeModeSelector);
    const opponentTotalTime = useAppSelector(gameOpponentTotalTimeSelector);
    const memoizedData = useRef({ score, elapsedTime, isChallengeMode, opponentTotalTime });

    useEffect(() => void dispatch(gameResetAction()), [dispatch]);

    const { current } = memoizedData;

    // eslint-disable-next-line react-hooks/refs
    return [isGameStarted, current.score, current.elapsedTime, current.isChallengeMode, current.opponentTotalTime] as const;
};
