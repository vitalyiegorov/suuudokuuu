import { useLingui } from '@lingui/react/macro';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { getErrorMessage } from '@rnw-community/shared';

import { Alert } from '../../@generic/components/alert/alert';
import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { gameResetAction } from '../store/game.actions';

export const useGameCreationRunner = () => {
    const dispatch = useAppDispatch();
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
                    dispatch(gameResetAction());
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

    return { dispatch, isCreatingGame, router, runGameCreation, showAlert };
};
