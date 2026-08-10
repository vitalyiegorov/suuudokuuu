import { useLingui } from '@lingui/react/macro';
import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import Share from 'react-native-share';

import { gameStateToString } from '../../utils/game-state-to-string.util';

import type { GameState } from '../../store/game.state';

export const useShareGameState = (kind: SharedPayloadKindEnum, gameState: GameState) => {
    const { t } = useLingui();

    const isHandoff = kind === SharedPayloadKindEnum.Handoff;
    const title = isHandoff ? t`SuuudokuuU game handoff` : t`SuuudokuuU Sudoku Puzzle`;
    const message = isHandoff ? t`Continue this Sudoku exactly where I left off!` : t`Check out this Sudoku puzzle!`;

    return async () => {
        try {
            await Share.open({ title, message, url: `https://suuudokuuu.com/shared/${gameStateToString(gameState, kind)}` });
        } catch {
            // User dismissed the share sheet - this is expected behavior
        }
    };
};
