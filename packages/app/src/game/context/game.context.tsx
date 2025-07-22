import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import React, { createContext, useState } from 'react';

import { emptyFn } from '@rnw-community/shared';

import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { gameResumeAction, gameStartAction } from '../store/game.actions';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { ReactNode } from 'react';

export const GameContext = createContext<{
    sudoku: Sudoku;
    createFromString: (sudokuString: string) => void;
    createFromDifficulty: (difficulty: DifficultyEnum) => void;
}>({ sudoku: new Sudoku(defaultSudokuConfig), createFromDifficulty: emptyFn, createFromString: emptyFn });

export const GameProvider = ({ children }: { readonly children: ReactNode }) => {
    const dispatch = useAppDispatch();

    const [sudoku, setSudoku] = useState(new Sudoku(defaultSudokuConfig));

    const createFromString = (sudokuString: string) => {
        setSudoku(Sudoku.fromString(sudokuString, defaultSudokuConfig));
        dispatch(gameResumeAction());
    };

    const createFromDifficulty = (difficulty: DifficultyEnum) => {
        sudoku.create(difficulty);
        setSudoku(sudoku);

        dispatch(gameStartAction({ sudokuString: sudoku.toString() }));
    };

    return <GameContext value={{ sudoku, createFromString, createFromDifficulty }}>{children}</GameContext>;
};
