import { useEffect } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { gameResumeAction, gameStartAction } from '../store/game.actions';
import { createSudokuGame, initializeSudokuFromString, sudoku } from '../store/sudoku-instance';

import type { DifficultyEnum } from '@suuudokuuu/generator';

export const useInitializeGame = (routeField: string | undefined, routeDifficulty: DifficultyEnum | undefined) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isNotEmptyString(routeField)) {
            initializeSudokuFromString(routeField);
            dispatch(gameResumeAction());
        } else if (isNotEmptyString(routeDifficulty)) {
            createSudokuGame(routeDifficulty);

            dispatch(gameStartAction({ sudokuString: sudoku.toString() }));
        }
    }, [routeField, routeDifficulty, dispatch]);
};