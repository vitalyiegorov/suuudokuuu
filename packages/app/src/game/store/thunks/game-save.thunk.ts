import { createAsyncThunk } from '@reduxjs/toolkit';

import { gameSaveAction } from '../game.actions';

import type { RootState } from '../../../@generic/app-root.store';
import type { ScoredCellsInterface, Sudoku } from '@suuudokuuu/generator';

interface GameSavePayloadInterface {
    sudoku: Sudoku;
    scoredCells: ScoredCellsInterface;
}

export const gameSaveThunk = createAsyncThunk<boolean, GameSavePayloadInterface, { state: RootState }>('game/save', (action, thunkAPI) => {
    const { sudoku } = action;

    const state = thunkAPI.getState();

    thunkAPI.dispatch(
        gameSaveAction({
            sudokuString: sudoku.toString(),
            score: state.game.score + sudoku.getScore(action.scoredCells, state.game.elapsedTime, state.game.mistakes),
            mistakes: state.game.mistakes
        })
    );

    return true;
});
