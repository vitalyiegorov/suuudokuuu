import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../../@generic/app-root.store';

export const gameSelector = (state: RootState) => state.game;

export const gameSudokuStringSelector = createSelector(gameSelector, state => state.sudokuString);
export const gameScoreSelector = createSelector(gameSelector, state => state.score);
export const gameMistakesSelector = createSelector(gameSelector, state => state.mistakes);
export const gamePausedSelector = createSelector(gameSelector, state => state.paused);
export const gameElapsedTimeSelector = createSelector(gameSelector, state => state.elapsedTime);
