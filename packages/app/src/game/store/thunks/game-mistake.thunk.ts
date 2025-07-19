import { createAsyncThunk } from '@reduxjs/toolkit';

import { gameSaveAction } from '../game.actions';

import type { RootState } from '../../../@generic/app-root.store';
import type { Sudoku } from '../../../@logic/classes/sudoku/sudoku';


export const gameMistakeThunk = createAsyncThunk<boolean, Sudoku, { state: RootState }>('game/save', (sudoku, thunkAPI) => {
    const state = thunkAPI.getState();

    thunkAPI.dispatch(
        gameSaveAction({
            sudokuString: sudoku.toString(),
            score: state.game.score,
            mistakes: state.game.mistakes + 1
        })
    );

    return true;
});
