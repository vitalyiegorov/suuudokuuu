import { createSelector } from '@reduxjs/toolkit';

import { type RootState } from '../../@app-root/store/app-root.store';
import { historyBestTime } from '../utils/history-best-time.util';
import { historyTotal } from '../utils/history-total.util';

export const historySelector = (state: RootState) => state.history;

export const historyGamesCompletedSelector = createSelector(historySelector, state => historyTotal(state, 'gamesCompleted'));
export const historyGamesWonSelector = createSelector(historySelector, state => historyTotal(state, 'gamesWon'));
export const historyGamesLostSelector = createSelector(historySelector, state => historyTotal(state, 'gamesLost'));
export const historyBestScoreSelector = createSelector(historySelector, state => historyTotal(state, 'bestScore'));
export const historyBestTimeSelector = createSelector(historySelector, state => historyBestTime(state));
