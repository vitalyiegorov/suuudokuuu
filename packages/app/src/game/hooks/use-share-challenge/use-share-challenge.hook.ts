import { useLingui } from '@lingui/react/macro';
import Share from 'react-native-share';

import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { gameStateToString } from '../../utils/game-state-to-string.util';

import type { GameState } from '../../store/game.state';

export const useShareChallenge = (gameState: GameState) => {
    const { t } = useLingui();
    const elapsedTimeString = useTimerText(gameState.elapsedTime);

    return async () => {
        try {
            await Share.open({
                title: t`SuuudokuuU Challenge`,
                message: t`I completed this Sudoku in ${elapsedTimeString}. Can you beat me?`,
                url: `https://suuudokuuu.com/shared/${gameStateToString(gameState, true)}`
            });
        } catch {
            // User dismissed the share sheet - this is expected behavior
        }
    };
};
