import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

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
        finish: state => {
            state.isFinished = true;
        },
        save: (state, action: PayloadAction<{ elapsedTime: number; sudokuString: string; newScore: number; mistakes: number }>) => {
            state.elapsedTime = action.payload.elapsedTime;
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
