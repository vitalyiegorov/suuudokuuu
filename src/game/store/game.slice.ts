import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { DifficultyEnum } from '../../@generic';

import { initialGameState } from './game.state';

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        start: (state, action: PayloadAction<DifficultyEnum>) => {
            Object.assign(state, initialGameState);

            state.difficulty = action.payload;
            state.startedAt = new Date();
        },
        move: (state, action: PayloadAction<string>) => {
            state.sudokuString = action.payload;
            state.endedAt = new Date();
        },
        reset: state => {
            Object.assign(state, initialGameState);
        }
    }
});
