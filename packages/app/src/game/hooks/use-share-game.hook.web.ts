import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';

import { useShareGameState } from './use-share-game-state/use-share-game-state.hook';

export const useShareGame = () => {
    const sharePuzzle = useShareGameState(SharedPayloadKindEnum.Puzzle);

    return () => void sharePuzzle();
};
