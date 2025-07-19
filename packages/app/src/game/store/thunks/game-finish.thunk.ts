import { createAsyncThunk } from '@reduxjs/toolkit';

import { historySaveAction } from '../../../history/store/history.actions';

import type { RootState } from '../../../@generic/app-root.store';
import type { HistoryRecordInterface } from '../../../history/interfaces/history-record.interface';

export const gameFinishedThunk = createAsyncThunk<boolean, HistoryRecordInterface, { state: RootState }>(
    'game/finish',
    (action, thunkAPI) => {
        const state = thunkAPI.getState();

        const { difficulty, isWon } = action;

        const current = state.history.byDifficulty[difficulty];
        const isBestScore = state.game.score > current.bestScore;

        thunkAPI.dispatch(
            historySaveAction({
                difficulty,
                bestScore: isBestScore ? state.game.score : current.bestScore,
                bestTime: isBestScore ? state.game.elapsedTime : current.bestTime,
                gamesCompleted: current.gamesCompleted + 1,
                gamesLost: isWon ? current.gamesLost : current.gamesLost + 1,
                gamesWon: isWon ? current.gamesWon + 1 : current.gamesWon
            })
        );

        return true;
    }
);
