import { useLingui } from '@lingui/react/macro';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { getErrorMessage } from '@rnw-community/shared';

import { Alert } from '../../@generic/components/alert/alert';
import { runCurrentRunCommand } from '../utils/run-current-run-command.util';

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
                    void runCurrentRunCommand(currentRunService => currentRunService.reset);
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
