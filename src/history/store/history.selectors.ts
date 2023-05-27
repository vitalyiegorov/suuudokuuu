import { createSelector } from '@reduxjs/toolkit';

import { type RootState } from '../../@app-root';
import { historyBestGame } from '../utils/history-best-time.util';
import { historyTotal } from '../utils/history-total.util';

export const historySelector = (state: RootState) => state.history;

export const historyGamesCompletedSelector = createSelector(historySelector, state => historyTotal(state, 'gamesCompleted'));
export const historyGamesWonSelector = createSelector(historySelector, state => historyTotal(state, 'gamesWon'));
export const historyGamesLostSelector = createSelector(historySelector, state => historyTotal(state, 'gamesLost'));
export const historyBestTimeSelector = createSelector(historySelector, state => historyBestGame(state));
