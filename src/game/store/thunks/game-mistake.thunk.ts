import { createAsyncThunk } from '@reduxjs/toolkit';

import { type RootState } from '../../../@app-root/store/app-root.store';
import { type Sudoku } from '../../../@logic';
import { gameSaveAction } from '../game.actions';

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
