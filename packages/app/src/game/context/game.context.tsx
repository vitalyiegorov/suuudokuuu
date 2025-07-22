import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { useRouter } from 'expo-router';
import React, { createContext, useState } from 'react';

import { emptyFn, getErrorMessage } from '@rnw-community/shared';

import { Alert } from '../../@generic/components/alert/alert';
import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { gameResetAction, gameResumeAction, gameStartAction } from '../store/game.actions';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { ReactNode } from 'react';

export const GameContext = createContext<{
    sudoku: Sudoku;
    createFromString: (sudokuString: string) => void;
    createFromDifficulty: (difficulty: DifficultyEnum) => void;
}>({ sudoku: new Sudoku(defaultSudokuConfig), createFromDifficulty: emptyFn, createFromString: emptyFn });

export const GameProvider = ({ children }: { readonly children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [sudoku, setSudoku] = useState(new Sudoku(defaultSudokuConfig));

    const createFromString = (sudokuString: string) => {
        try {
            setSudoku(Sudoku.fromString(sudokuString, defaultSudokuConfig));
            dispatch(gameResumeAction());
        } catch (error) {
            Alert('Invalid Sudoku', getErrorMessage(error), [
                {
                    text: 'OK',
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
        router.push(`game?field=${sudokuString}`);
    };

    return <GameContext value={{ sudoku, createFromString, createFromDifficulty }}>{children}</GameContext>;
};
