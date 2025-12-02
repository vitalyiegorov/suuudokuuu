import { useLingui } from '@lingui/react/macro';
import Share from 'react-native-share';

import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { gameSelector } from '../store/game.selectors';
import { GameState } from '../store/game.state';
import { gameStateToString } from '../utils/game-state-to-string.util';

const getShareUrl = (gameState: GameState): string =>
    typeof window === 'undefined' ? '' : `${window.location.origin}/shared/${gameStateToString(gameState)}`;

export const useSharePuzzle = () => {
    const gameState = useAppSelector(gameSelector);
    const { t } = useLingui();

    const shareUrl = getShareUrl(gameState);

    return async () => {
        try {
            await Share.open({
                title: t`SuuudokuuU Sudoku Puzzle`,
                message: t`Check out this Sudoku puzzle!`,
                url: shareUrl
            });
        } catch {
            // User dismissed the share sheet - this is expected behavior
        }
    };
};
