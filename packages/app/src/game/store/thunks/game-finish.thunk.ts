import { createAsyncThunk } from '@reduxjs/toolkit';

import { emptyGameHistory } from '../../../history/interfaces/history-game.interface';
import { historySaveAction } from '../../../history/store/history.actions';

import type { RootState } from '../../../@generic/app-root.store';
import type { HistoryRecordInterface } from '../../../history/interfaces/history-record.interface';

export const gameFinishedThunk = createAsyncThunk<boolean, HistoryRecordInterface, { state: RootState }>(
    'game/finish',
    (action, thunkAPI) => {
        const state = thunkAPI.getState();

        const { difficulty, isWon } = action;

        const current = { ...emptyGameHistory, ...state.history.byDifficulty[difficulty] };
        const isBestScore = state.game.score > current.bestScore;

        thunkAPI.dispatch(
            historySaveAction({
                difficulty,
                bestScore: isBestScore ? state.game.score : current.bestScore,
                bestTime: isBestScore ? state.game.elapsedTime : current.bestTime,
                gamesCompleted: current.gamesCompleted + 1,
                gamesLost: isWon ? current.gamesLost : current.gamesLost + 1,
                gamesWon: isWon ? current.gamesWon + 1 : current.gamesWon,
                averageTime: (current.averageTime * current.gamesCompleted + state.game.elapsedTime) / (current.gamesCompleted + 1),
                gamesWonWithoutMistakes:
                    isWon && state.game.mistakes === 0 ? current.gamesWonWithoutMistakes + 1 : current.gamesWonWithoutMistakes,
                hardcoreWon: isWon && state.game.maxMistakes === 0 ? current.hardcoreWon + 1 : current.hardcoreWon
            })
        );

        return true;
    }
);
