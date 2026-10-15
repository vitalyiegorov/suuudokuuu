import { findHintStepScript } from '@suuudokuuu/field-core';
import * as Effect from 'effect/Effect';
import { use, useEffect, useRef, useState } from 'react';

import { emptyFn, isDefined } from '@rnw-community/shared';

import { appRuntime } from '../../@generic/runtime/app.runtime';
import { logErrorCause } from '../../@generic/utils/log-error-cause.util';
import { LoaderPaintDelayMillisecondsConstant } from '../constant/loader-paint-delay.constant';
import { GameContext } from '../context/game.context';
import { gameStartHintStepScript } from '../utils/game-start-hint-step-script.util';

import type * as Fiber from 'effect/Fiber';

export const useHintSearch = () => {
    const { engine } = use(GameContext);
    const searchFiberRef = useRef<Fiber.Fiber<void> | null>(null);
    const [isSearchingHint, setIsSearchingHint] = useState(false);

    const searchHint = (beforeSearch: () => void = emptyFn) => {
        if (isDefined(searchFiberRef.current)) {
            return;
        }

        setIsSearchingHint(true);
        searchFiberRef.current = appRuntime.runFork(
            Effect.sleep(LoaderPaintDelayMillisecondsConstant).pipe(
                Effect.andThen(
                    Effect.sync(() => {
                        beforeSearch();

                        const { eliminatedCandidates, hintEliminationStreak } = engine.getSnapshot();
                        const stepScript = findHintStepScript(engine.Sudoku, eliminatedCandidates, hintEliminationStreak);

                        if (isDefined(stepScript)) {
                            gameStartHintStepScript(engine, stepScript);
                        }
                    })
                ),
                Effect.tapCause(logErrorCause),
                Effect.ensuring(
                    Effect.sync(() => {
                        searchFiberRef.current = null;
                        setIsSearchingHint(false);
                    })
                )
            )
        );
    };

    useEffect(() => () => searchFiberRef.current?.interruptUnsafe(), []);

    return { isSearchingHint, searchHint };
};
