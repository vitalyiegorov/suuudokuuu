import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { initialGameState } from './game.state';

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        start: (state, action: PayloadAction<{ sudokuString: string }>) => {
            Object.assign(state, initialGameState);

            state.sudokuString = action.payload.sudokuString;
        },
        pause: state => {
            state.paused = true;
        },
        resume: state => {
            state.paused = false;
        },
        save: (state, action: PayloadAction<{ sudokuString: string; score: number; mistakes: number }>) => {
            state.sudokuString = action.payload.sudokuString;
            state.score = action.payload.score;
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
