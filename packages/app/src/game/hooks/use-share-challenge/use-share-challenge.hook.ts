import { useLingui } from '@lingui/react/macro';
import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';

import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { useShareGameState } from '../use-share-game-state/use-share-game-state.hook';

import type { CurrentRunType } from '@suuudokuuu/progress';

export const useShareChallenge = (gameState: CurrentRunType) => {
    const { t } = useLingui();
    const elapsedTimeString = useTimerText(gameState.elapsedTime);

    return useShareGameState(
        SharedPayloadKindEnum.Challenge,
        gameState,
        t`SuuudokuuU Challenge`,
        t`I completed this Sudoku in ${elapsedTimeString}. Can you beat me?`
    );
};
