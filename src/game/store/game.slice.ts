import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { initialGameState } from './game.state';

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        pause: state => {
            state.paused = true;
        },
        resume: state => {
            state.paused = false;
        },
        save: (state, action: PayloadAction<string>) => {
            state.sudokuString = action.payload;
        },
        tick: state => {
            state.elapsedTime += 1;
        },
        reset: state => {
            Object.assign(state, initialGameState);
        }
    }
});
