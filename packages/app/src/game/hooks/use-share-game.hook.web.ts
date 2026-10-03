import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';

import { useCurrentRun } from '../query/use-current-run.query';
import { useElapsedTime } from '../query/use-elapsed-time.query';

import { useShareGameState } from './use-share-game-state/use-share-game-state.hook';

export const useShareGame = () => {
    const state = { ...useCurrentRun(), elapsedTime: useElapsedTime() };
    const sharePuzzle = useShareGameState(SharedPayloadKindEnum.Puzzle, state);

    return () => void sharePuzzle();
};
