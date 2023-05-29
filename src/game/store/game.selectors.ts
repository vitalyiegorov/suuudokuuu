import { createSelector } from '@reduxjs/toolkit';

import { type RootState } from '../../@app-root';

export const gameSelector = (state: RootState) => state.game;

export const gameFieldSelector = createSelector(gameSelector, state => state.field);
export const gameAvailableValuesSelector = createSelector(gameSelector, state => state.availableValues);
export const gamePossibleValuesSelector = createSelector(gameSelector, state => state.possibleValues);
export const gameFullFieldSelector = createSelector(gameSelector, state => state.fullField);
export const gameSelectedCellSelector = createSelector(gameSelector, state => state.selectedCell);
export const gameMistakesSelector = createSelector(gameSelector, state => state.mistakes);
export const gameStartedAtSelector = createSelector(gameSelector, state => new Date(state.startedAt));
export const gameEndedAtSelector = createSelector(gameSelector, state => new Date(state.endedAt));
export const gameScoreSelector = createSelector(gameSelector, state => state.score);
export const gameScoredCellsSelector = createSelector(gameSelector, state => state.scoredCells);
