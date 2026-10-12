import { gameStateToString } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';

import { appRuntime } from '../../../@generic/runtime/app.runtime';

import type { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import type { CurrentRunType } from '@suuudokuuu/progress';

export const useShareGameState = (kind: SharedPayloadKindEnum, gameState: CurrentRunType) => () => {
    appRuntime.runFork(
        Effect.tryPromise(() => Sharing.isAvailableAsync()).pipe(
            Effect.flatMap(isAvailable =>
                isAvailable
                    ? Effect.tryPromise(() =>
                          Share.share({ url: `${window.location.origin}/shared/${gameStateToString(gameState, kind)}` })
                      ).pipe(
                          Effect.catch(error =>
                              error.cause instanceof DOMException && error.cause.name === 'AbortError' ? Effect.void : Effect.fail(error)
                          )
                      )
                    : Effect.void
            ),
            Effect.tapCause(Effect.logError)
        )
    );
};
