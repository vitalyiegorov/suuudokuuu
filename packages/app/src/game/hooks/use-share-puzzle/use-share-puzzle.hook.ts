import { useLingui } from '@lingui/react/macro';
import Share from 'react-native-share';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameSelector } from '../../store/game.selectors';
import { gameStateToString } from '../../utils/game-state-to-string.util';

export const useSharePuzzle = () => {
    const state = useAppSelector(gameSelector);
    const { t } = useLingui();

    return async () => {
        try {
            await Share.open({
                title: t`SuuudokuuU Sudoku Puzzle`,
                message: t`Check out this Sudoku puzzle!`,
                url: `suuudokuuu://shared/${gameStateToString(state, false)}`
            });
        } catch {
            // User dismissed the share sheet - this is expected behavior
        }
    };
};
