import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type GameInterface } from '../../interfaces/game.interface';
import { gameToGameHistory } from '../../utils/history/game-to-game-history.util';

import { initialHistoryState } from './history.state';

export const historySlice = createSlice({
    name: 'history',
    initialState: initialHistoryState,
    reducers: {
        record: (state, action: PayloadAction<GameInterface>) => {
            state.byDifficulty[action.payload.difficulty] = gameToGameHistory(
                action.payload,
                state.byDifficulty[action.payload.difficulty]
            );
        }
    }
});
