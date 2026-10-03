import { useLingui } from '@lingui/react/macro';
import { CurrentRunService } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { getErrorMessage } from '@rnw-community/shared';

import { Alert } from '../../@generic/components/alert/alert';
import { appRuntime } from '../../@generic/runtime/app.runtime';

export const useGameCreationRunner = () => {
    const router = useRouter();
    const { t } = useLingui();

    const pathname = usePathname();
    const isCreatingGameRef = useRef(false);
    const creationPathnameRef = useRef(pathname);
    const [isCreatingGame, setIsCreatingGame] = useState(false);

    const showAlert = (error: unknown) => {
        Alert(t`Invalid Sudoku`, getErrorMessage(error), [
            {
                onPress: () => {
                    void appRuntime.runPromise(Effect.flatMap(CurrentRunService, currentRunService => currentRunService.reset));
                    router.replace('/');
                },
                text: t`OK`
            }
        ]);
    };

    const finishGameCreation = () => {
        isCreatingGameRef.current = false;
        setIsCreatingGame(false);
    };

    const runGameCreation = (operation: () => void) => {
        if (isCreatingGameRef.current) {
            return;
        }

        isCreatingGameRef.current = true;
        creationPathnameRef.current = pathname;
        setIsCreatingGame(true);

        requestAnimationFrame(() =>
            requestAnimationFrame(() => {
                try {
                    operation();
                } catch (error: unknown) {
                    finishGameCreation();
                    showAlert(error);
                }
            })
        );
    };

    useEffect(() => {
        if (isCreatingGameRef.current && pathname !== creationPathnameRef.current) {
            finishGameCreation();
        }
    }, [pathname]);

    return { isCreatingGame, router, runGameCreation, showAlert };
};
