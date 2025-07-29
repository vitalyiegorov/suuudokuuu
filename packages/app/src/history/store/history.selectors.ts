import { createSelector } from '@reduxjs/toolkit';

import { historyBestGame } from '../utils/history-best-game.util';

import type { RootState } from '../../@generic/app-root.store';
import type { DifficultyEnum } from '@suuudokuuu/generator';

const historySelector = (state: RootState) => state.history;

export const historyBestTimeSelector = createSelector(historySelector, state => historyBestGame(state));
export const historyDifficultySelector = (difficulty: DifficultyEnum) =>
    createSelector(historySelector, state => state.byDifficulty[difficulty]);
