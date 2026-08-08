import { useLingui } from '@lingui/react/macro';
import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';

import { Alert } from '../../@generic/components/alert/alert';
import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { gameSelector } from '../store/game.selectors';

import { useShareGameState } from './use-share-game-state/use-share-game-state.hook';

export const useShareGame = () => {
    const { t } = useLingui();
    const state = useAppSelector(gameSelector);
    const sharePuzzle = useShareGameState(SharedPayloadKindEnum.Puzzle, state);
    const shareHandoff = useShareGameState(SharedPayloadKindEnum.Handoff, state);

    return () => {
        Alert(t`Share this game`, t`Send the puzzle to solve from scratch, or hand off your run to continue elsewhere.`, [
            { text: t`Cancel`, style: 'cancel' },
            { text: t`Share puzzle`, onPress: () => void sharePuzzle() },
            { text: t`Continue elsewhere`, onPress: () => void shareHandoff() }
        ]);
    };
};
