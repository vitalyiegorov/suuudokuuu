import { useLingui } from '@lingui/react/macro';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { useRouter } from 'expo-router';
import React, { createContext, useState } from 'react';

import { emptyFn, getErrorMessage, isNotEmptyString } from '@rnw-community/shared';

import { Alert } from '../../@generic/components/alert/alert';
import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { gameLoadAction, gameResetAction, gameResumeAction, gameStartAction } from '../store/game.actions';
import { gameSudokuStringSelector } from '../store/game.selectors';
import { urlToGameState } from '../store/game.state';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { ReactNode } from 'react';

export const GameContext = createContext<{
    sudoku: Sudoku;
    createFromState: (stateString: string) => void;
    createFromDifficulty: (difficulty: DifficultyEnum) => void;
}>({ sudoku: new Sudoku(defaultSudokuConfig), createFromDifficulty: emptyFn, createFromState: emptyFn });

export const GameProvider = ({ children }: { readonly children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { t } = useLingui();

    const currentGameString = useAppSelector(gameSudokuStringSelector);

    const showAlert = (error: unknown) => {
        Alert(t`Invalid Sudoku`, getErrorMessage(error), [
            {
                text: t`OK`,
                onPress: () => {
                    dispatch(gameResetAction());
                    router.replace('/');
                }
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

    const createFromState = (stateString: string) => {
        try {
            const newState = urlToGameState(stateString);
            dispatch(gameLoadAction(newState));

            setSudoku(Sudoku.fromString(newState.sudokuString, defaultSudokuConfig));

            dispatch(gameResumeAction());

            router.replace(`game`);

            return true;
        } catch (error) {
            showAlert(error);

            return false;
        }
    };

    const createFromDifficulty = (difficulty: DifficultyEnum) => {
        sudoku.create(difficulty);
        setSudoku(sudoku);

        const sudokuString = sudoku.toString();
        dispatch(gameStartAction({ sudokuString }));
        router.push(`game`);
    };

    return <GameContext value={{ sudoku, createFromState, createFromDifficulty }}>{children}</GameContext>;
};
