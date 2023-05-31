import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { DifficultyEnum } from '../../@generic';

import { initialGameState } from './game.state';

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        start: (state, action: PayloadAction<{ difficulty: DifficultyEnum; sudokuString: string }>) => {
            Object.assign(state, initialGameState);

            state.difficulty = action.payload.difficulty;
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
        save: (state, action: PayloadAction<{ sudokuString: string; newScore: number; mistakes: number }>) => {
            state.sudokuString = action.payload.sudokuString;
            state.score = action.payload.newScore;
            state.mistakes = action.payload.mistakes;
        },
        reset: state => {
            Object.assign(state, initialGameState);
        }
    }
});
