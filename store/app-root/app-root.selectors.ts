import { createSelector } from '@reduxjs/toolkit';

import { type RootState } from '../create-store';

const appRootSelector = (state: RootState) => state.appRoot;
export const appRootFieldSelector = createSelector(appRootSelector, state => state.gameField);
export const appRootSelectedCellSelector = createSelector(appRootSelector, state => state.selectedCell);
