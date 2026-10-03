import { useLingui } from '@lingui/react/macro';
import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import { gameStateToString } from '@suuudokuuu/progress';
import Share from 'react-native-share';

import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';

import type { CurrentRunType } from '@suuudokuuu/progress';

export const useShareChallenge = (gameState: CurrentRunType) => {
    const { t } = useLingui();
    const elapsedTimeString = useTimerText(gameState.elapsedTime);

    return async () => {
        try {
            await Share.open({
                title: t`SuuudokuuU Challenge`,
                message: t`I completed this Sudoku in ${elapsedTimeString}. Can you beat me?`,
                url: `https://suuudokuuu.com/shared/${gameStateToString(gameState, SharedPayloadKindEnum.Challenge)}`
            });
        } catch {
            // User dismissed the share sheet - this is expected behavior
        }
    };
};
