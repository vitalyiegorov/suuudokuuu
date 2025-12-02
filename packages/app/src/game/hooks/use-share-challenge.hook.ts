import { useLingui } from '@lingui/react/macro';
import Share from 'react-native-share';

import { getTimerText } from '../../@generic/utils/get-timer-text.util';
import { gameStateToString } from '../utils/game-state-to-string.util';

import type { GameState } from '../store/game.state';

interface Props {
    readonly gameState: GameState;
}

const getShareUrl = (gameState: GameState): string =>
    typeof window === 'undefined' ? '' : `${window.location.origin}/shared/${gameStateToString(gameState, true)}`;

export const useShareChallenge = ({ gameState }: Props) => {
    const { t } = useLingui();
    const elapsedTimeString = getTimerText(gameState.elapsedTime);

    const shareUrl = getShareUrl(gameState);

    return async () => {
        try {
            await Share.open({
                title: t`SuuudokuuU Challenge`,
                message: t`I completed this Sudoku in ${elapsedTimeString}. Can you beat me?`,
                url: shareUrl
            });
        } catch {
            // User dismissed the share sheet - this is expected behavior
        }
    };
};
