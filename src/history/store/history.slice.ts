import { createSlice } from '@reduxjs/toolkit';

import { gameFinishAction } from '../../game/store/game.actions';

import { initialHistoryState } from './history.state';

export const historySlice = createSlice({
    name: 'history',
    initialState: initialHistoryState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(gameFinishAction, (state, action) => {
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
        });
    }
});
