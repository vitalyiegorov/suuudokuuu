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
        pause: (state, action: PayloadAction<number>) => {
            state.paused = true;
            state.elapsedTime = action.payload;
        },
        resume: state => {
            state.paused = false;
        },
        save: (state, action: PayloadAction<{ elapsedTime: number; sudokuString: string; newScore: number; mistakes: number }>) => {
            state.elapsedTime = action.payload.elapsedTime;
            state.sudokuString = action.payload.sudokuString;
            state.score = action.payload.newScore;
            state.mistakes = action.payload.mistakes;
        },
        updateTime: (state, action: PayloadAction<number>) => {
            state.elapsedTime = action.payload;
        },
        reset: state => {
            Object.assign(state, initialGameState);
        }
    }
});
