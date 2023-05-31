import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../../@app-root';

export const gameSelector = (state: RootState) => state.game;

export const gameStartedAtSelector = createSelector(gameSelector, state => new Date(state.startedAt));
export const gameSudokuStringSelector = createSelector(gameSelector, state => state.sudokuString);
export const gameEndedAtSelector = createSelector(gameSelector, state => new Date(state.endedAt));
export const gameScoreSelector = createSelector(gameSelector, state => state.score);
