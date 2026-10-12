import { useLingui } from '@lingui/react/macro';
import * as Cause from 'effect/Cause';
import * as Effect from 'effect/Effect';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { getErrorMessage, isDefined } from '@rnw-community/shared';

import { Alert } from '../../@generic/components/alert/alert';
import { appRuntime } from '../../@generic/runtime/app.runtime';
import { PuzzleGenerationService } from '../service/puzzle-generation.service';
import { runCurrentRunCommand } from '../utils/run-current-run-command.util';

import type { AppServices } from '../../@generic/runtime/app.runtime';
import type * as Fiber from 'effect/Fiber';

const loaderPaintDelayMilliseconds = 32;

export const useGameCreationRunner = () => {
    const router = useRouter();
    const { t } = useLingui();
    const pathname = usePathname();
    const creationFiberRef = useRef<Fiber.Fiber<void> | null>(null);
    const creationPathnameRef = useRef(pathname);
    const [isCreatingGame, setIsCreatingGame] = useState(false);

    const showAlert = (error: unknown) => {
        Alert(t`Invalid Sudoku`, getErrorMessage(error), [
            {
                onPress: () => {
                    void runCurrentRunCommand(currentRunService => currentRunService.reset);
                    router.replace('/');
                },
                text: t`OK`
            }
        ]);
    };

    const runGameCreation = (operation: Effect.Effect<void, unknown, AppServices>) => {
        if (isDefined(creationFiberRef.current)) {
            return;
        }

        creationPathnameRef.current = pathname;
        setIsCreatingGame(true);
        creationFiberRef.current = appRuntime.runFork(
            Effect.sleep(loaderPaintDelayMilliseconds).pipe(
                Effect.andThen(operation),
                Effect.catchCause(cause => {
                    if (Cause.hasInterruptsOnly(cause)) {
                        return Effect.interrupt;
                    }

                    return Effect.logError('game-creation-failed', cause).pipe(
                        Effect.andThen(Effect.sync(() => void showAlert(Cause.squash(cause))))
                    );
                }),
                Effect.ensuring(
                    Effect.sync(() => {
                        creationFiberRef.current = null;
                        setIsCreatingGame(false);
                    })
                )
            )
        );
    };

    useEffect(() => {
        if (pathname !== creationPathnameRef.current) {
            creationFiberRef.current?.interruptUnsafe();
        }
    }, [pathname]);

    useEffect(() => {
        const warmup = appRuntime.runFork(
            Effect.flatMap(PuzzleGenerationService, service => service.warm).pipe(
                Effect.catch(error => Effect.logWarning('puzzle-runtime-warmup-failed', error))
            )
        );
        const subscription = AppState.addEventListener('change', state => {
            if (state !== 'active') {
                creationFiberRef.current?.interruptUnsafe();
            }
        });

        return () => {
            warmup.interruptUnsafe();
            creationFiberRef.current?.interruptUnsafe();
            subscription.remove();
        };
    }, []);

    return { isCreatingGame, router, runGameCreation, showAlert };
};
