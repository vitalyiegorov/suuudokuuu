import { useLingui } from '@lingui/react/macro';
import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import { gameStateToString } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import Share from 'react-native-share';

import { appRuntime } from '../../../@generic/runtime/app.runtime';

import type { CurrentRunType } from '@suuudokuuu/progress';

export const useShareGameState = (kind: SharedPayloadKindEnum, gameState: CurrentRunType, sharedTitle?: string, sharedMessage?: string) => {
    const { t } = useLingui();
    const isHandoff = kind === SharedPayloadKindEnum.Handoff;
    const defaultTitle = isHandoff ? t`SuuudokuuU game handoff` : t`SuuudokuuU Sudoku Puzzle`;
    const title = sharedTitle ?? defaultTitle;
    const defaultMessage = isHandoff ? t`Continue this Sudoku exactly where I left off!` : t`Check out this Sudoku puzzle!`;
    const message = sharedMessage ?? defaultMessage;

    return () => {
        appRuntime.runFork(
            Effect.tryPromise(() =>
                Share.open({
                    title,
                    message,
                    url: `https://suuudokuuu.com/shared/${gameStateToString(gameState, kind)}`,
                    failOnCancel: false
                })
            ).pipe(Effect.tapCause(Effect.logError))
        );
    };
};
