import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../../@generic/app-root.store';
import { historyBestGame } from '../utils/history-best-game.util';

const historySelector = (state: RootState) => state.history;

export const historyBestTimeSelector = createSelector(historySelector, state => historyBestGame(state));
