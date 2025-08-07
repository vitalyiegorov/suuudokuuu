import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../../@generic/app-root.store';
import type { DifficultyEnum } from '@suuudokuuu/generator';

const gameSelector = (state: RootState) => state.game;

export const gameSudokuStringSelector = createSelector(gameSelector, state => state.sudokuString);
export const gameScoreSelector = createSelector(gameSelector, state => state.score);
export const gameMistakesSelector = createSelector(gameSelector, state => state.mistakes);
export const gameMaxMistakesSelector = createSelector(gameSelector, state => state.maxMistakes);
export const gamePausedSelector = createSelector(gameSelector, state => state.isPaused);
export const gameElapsedTimeSelector = createSelector(gameSelector, state => state.elapsedTime);
export const gameHasCandidatesSelector = createSelector(gameSelector, state => state.hasCandidates);

const gameHistorySelector = (state: RootState) => state.game;

export const gameHistoryByDifficultySelector = createSelector(gameHistorySelector, state => state.historyByDifficulty);
export const gameHistoryBestTimeSelector = createSelector(gameHistorySelector, state =>
    Object.values(state.historyByDifficulty).reduce(
        (max, gameHistory) => (gameHistory.bestScore > max[0] ? [gameHistory.bestScore, gameHistory.bestTime] : max),
        [0, 0]
    )
);
export const gameHistoryDifficultySelector = (difficulty: DifficultyEnum) =>
    createSelector(gameHistorySelector, state => state.historyByDifficulty[difficulty]);
