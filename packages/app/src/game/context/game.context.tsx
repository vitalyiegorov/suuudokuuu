import { useLingui } from '@lingui/react/macro';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { useRouter } from 'expo-router';
import React, { createContext, useState } from 'react';

import { emptyFn, getErrorMessage } from '@rnw-community/shared';

import { Alert } from '../../@generic/components/alert/alert';
import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { gameLoadAction, gameResetAction, gameResumeAction, gameStartAction } from '../store/game.actions';

import type { SerializedGameState } from '../store/game.state';
import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { ReactNode } from 'react';

export const GameContext = createContext<{
    sudoku: Sudoku;
    createFromString: (state: SerializedGameState) => void;
    createFromDifficulty: (difficulty: DifficultyEnum) => void;
}>({ sudoku: new Sudoku(defaultSudokuConfig), createFromDifficulty: emptyFn, createFromString: emptyFn });

export const GameProvider = ({ children }: { readonly children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { t } = useLingui();

    const [sudoku, setSudoku] = useState(new Sudoku(defaultSudokuConfig));

    const createFromString = (state: SerializedGameState) => {
        try {
            setSudoku(Sudoku.fromString(state.sudokuString, defaultSudokuConfig));
            dispatch(gameLoadAction(state));
            dispatch(gameResumeAction());
        } catch (error) {
            Alert(t`Invalid Sudoku`, getErrorMessage(error), [
                {
                    text: t`OK`,
                    onPress: () => {
                        dispatch(gameResetAction());
                        router.replace('/');
                    }
                }
            ]);
        }
    };

    const createFromDifficulty = (difficulty: DifficultyEnum) => {
        sudoku.create(difficulty);
        setSudoku(sudoku);

        const sudokuString = sudoku.toString();
        dispatch(gameStartAction({ sudokuString }));
        router.push(`game?sudokuString=${sudokuString}`);
    };

    return <GameContext value={{ sudoku, createFromString, createFromDifficulty }}>{children}</GameContext>;
};
