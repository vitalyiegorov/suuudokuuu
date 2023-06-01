import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { type HistoryRecordInterface } from '../interfaces/history-record.interface';

import { initialHistoryState } from './history.state';

export const historySlice = createSlice({
    name: 'history',
    initialState: initialHistoryState,
    reducers: {
        record: (state, action: PayloadAction<HistoryRecordInterface>) => {
            const { difficulty, isWon, score, elapsedTime } = action.payload;

            const current = state.byDifficulty[difficulty];
            const isBestScore = score > current.bestScore;

            state.byDifficulty[difficulty] = {
                difficulty,
                bestScore: isBestScore ? score : current.bestScore,
                bestTime: isBestScore ? elapsedTime : current.bestTime,
                gamesCompleted: current.gamesCompleted + 1,
                gamesLost: isWon ? current.gamesLost : current.gamesLost + 1,
                gamesWon: isWon ? current.gamesWon + 1 : current.gamesWon
            };
        }
    }
});
