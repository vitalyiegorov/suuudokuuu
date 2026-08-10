import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';

import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { gameSelector } from '../store/game.selectors';

import { useShareGameState } from './use-share-game-state/use-share-game-state.hook';

export const useShareGame = () => {
    const state = useAppSelector(gameSelector);
    const sharePuzzle = useShareGameState(SharedPayloadKindEnum.Puzzle, state);

    return () => void sharePuzzle();
};
