import { createSelector } from '@reduxjs/toolkit';

import { historyBestGame } from '../utils/history-best-game.util';

import type { RootState } from '../../@generic/app-root.store';

const historySelector = (state: RootState) => state.history;

export const historyBestTimeSelector = createSelector(historySelector, state => historyBestGame(state));
