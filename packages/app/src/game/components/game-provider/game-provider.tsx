import { i18n } from '@lingui/core';
import { useLingui } from '@lingui/react/macro';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { getErrorMessage, isNotEmptyString } from '@rnw-community/shared';

import { Alert } from '../../../@generic/components/alert/alert';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsLanguageSelector } from '../../../settings/store/settings.selectors';
import { GameContext } from '../../context/game.context';
import { gameLoadAction, gameResetAction, gameResumeAction, gameStartAction } from '../../store/game.actions';
import { gameSudokuStringSelector } from '../../store/game.selectors';

import type { GameSetupInterface } from '../../interface/game-setup.interface';
import type { GameState } from '../../store/game.state';
import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const GameProvider = ({ children }: Props) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { t } = useLingui();

    const pathname = usePathname();
    const isCreatingGameRef = useRef(false);
    const creationPathnameRef = useRef(pathname);
    const [isCreatingGame, setIsCreatingGame] = useState(false);

    const currentGameString = useAppSelector(gameSudokuStringSelector);
    const currentLanguage = useAppSelector(settingsLanguageSelector);

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

    const [sudoku, setSudoku] = useState(() => {
        if (isNotEmptyString(currentGameString)) {
            try {
                return Sudoku.fromString(currentGameString, defaultSudokuConfig);
            } catch (error: unknown) {
                showAlert(error);
            }
        }

        return new Sudoku(defaultSudokuConfig);
    });

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

    const createFromState = (newState: GameState) =>
        void runGameCreation(() => {
            const needsWallClock = isNotEmptyString(newState.challengeState) || newState.isChallengeRun;
            dispatch(gameLoadAction({ ...newState, ...(needsWallClock && { wallClockStartMs: Date.now() }) }));

            setSudoku(Sudoku.fromString(newState.sudokuString, defaultSudokuConfig));

            dispatch(gameResumeAction());

            router.replace('/game');
        });

    const create = ({ difficulty, isChallengeRun, maxMistakes }: GameSetupInterface) =>
        void runGameCreation(() => {
            const newSudoku = new Sudoku(defaultSudokuConfig);

            newSudoku.create(difficulty);
            setSudoku(newSudoku);

            const sudokuString = newSudoku.toString();
            dispatch(gameStartAction({ difficulty, isChallengeRun, maxMistakes, sudokuString }));
            router.push('/game');
        });

    useEffect(() => {
        if (isCreatingGameRef.current && pathname !== creationPathnameRef.current) {
            finishGameCreation();
        }
    }, [pathname]);

    useEffect(() => void i18n.activate(currentLanguage), [currentLanguage]);

    const value = { create, createFromState, isCreatingGame, sudoku };

    return <GameContext value={value}>{children}</GameContext>;
};
