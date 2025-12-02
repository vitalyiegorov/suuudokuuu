import { useLingui } from '@lingui/react/macro';
import Share from 'react-native-share';

import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { gameStateToString } from '../../utils/game-state-to-string.util';

import type { GameState } from '../../store/game.state';

interface Props {
    readonly gameState: GameState;
}

export const useShareChallenge = ({ gameState }: Props) => {
    const { t } = useLingui();

    return async () => {
        const elapsedTimeString = getTimerText(gameState.elapsedTime);

        try {
            await Share.open({
                title: t`SuuudokuuU Challenge`,
                message: t`I completed this Sudoku in ${elapsedTimeString}. Can you beat me?`,
                url: `suuudokuuu://shared/${gameStateToString(gameState, true)}`
            });
        } catch {
            // User dismissed the share sheet - this is expected behavior
        }
    };
};
