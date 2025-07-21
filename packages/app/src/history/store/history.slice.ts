import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { initialHistoryState } from './history.state';

import type { HistoryGameInterface } from '../interfaces/history-game.interface';

export const historySlice = createSlice({
    name: 'history',
    initialState: initialHistoryState,
    reducers: {
        save: (state, action: PayloadAction<HistoryGameInterface>) => {
            state.byDifficulty[action.payload.difficulty] = action.payload;
        }
    }
});
