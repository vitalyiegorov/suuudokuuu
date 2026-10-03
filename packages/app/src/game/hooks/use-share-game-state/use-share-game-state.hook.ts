import { useLingui } from '@lingui/react/macro';
import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import { gameStateToString } from '@suuudokuuu/progress';
import Share from 'react-native-share';

import type { CurrentRunType } from '@suuudokuuu/progress';

export const useShareGameState = (kind: SharedPayloadKindEnum, gameState: CurrentRunType) => {
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
