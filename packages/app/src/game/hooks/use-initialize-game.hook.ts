import { useEffect } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { gameResumeAction, gameStartAction } from '../store/game.actions';
import { createSudokuGame, initializeSudokuFromString, sudoku } from '../store/sudoku-instance';

import type { CellInterface, DifficultyEnum } from '@suuudokuuu/generator';

interface UseInitializeGameParams {
    readonly routeField: string | undefined;
    readonly routeDifficulty: DifficultyEnum | undefined;
    readonly setSelectedCell: (cell: CellInterface | undefined) => void;
}

export const useInitializeGame = ({ routeField, routeDifficulty, setSelectedCell }: UseInitializeGameParams) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isNotEmptyString(routeField)) {
            initializeSudokuFromString(routeField);
            dispatch(gameResumeAction());
        } else if (isNotEmptyString(routeDifficulty)) {
            createSudokuGame(routeDifficulty);

            // eslint-disable-next-line no-undefined
            setSelectedCell(undefined);

            dispatch(gameStartAction({ sudokuString: sudoku.toString() }));
        }
    }, [routeField, routeDifficulty, dispatch, setSelectedCell]);
};