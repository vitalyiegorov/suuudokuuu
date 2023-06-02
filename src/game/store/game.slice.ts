import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { type HistoryRecordInterface } from '../../history';

import { initialGameState } from './game.state';

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        start: (state, action: PayloadAction<{ sudokuString: string }>) => {
            Object.assign(state, initialGameState);

            state.sudokuString = action.payload.sudokuString;
            state.elapsedTime = 0;
        },
        pause: state => {
            state.paused = true;
        },
        resume: state => {
            state.paused = false;
        },
        finish: (state, _action: PayloadAction<HistoryRecordInterface>) => {
            state.isFinished = true;
        },
        save: (state, action: PayloadAction<{ sudokuString: string; newScore: number; mistakes: number }>) => {
            state.sudokuString = action.payload.sudokuString;
            state.score = action.payload.newScore;
            state.mistakes = action.payload.mistakes;
        },
        tick: state => {
            state.elapsedTime += 1;
        },
        reset: state => {
            Object.assign(state, initialGameState);
        }
    }
});
