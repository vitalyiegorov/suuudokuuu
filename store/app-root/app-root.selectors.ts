import { createSelector } from '@reduxjs/toolkit';

import { getAvailableFieldValues } from '../../utils/get-available-field-values.util';
import { type RootState } from '../app.store';

export const appRootSelector = (state: RootState) => state.appRoot;

export const appRootFieldSelector = createSelector(appRootSelector, state => state.gameField);
export const appRootFilledFieldSelector = createSelector(appRootSelector, state => state.filledField);
export const appRootSelectedCellSelector = createSelector(appRootSelector, state => state.selectedCell);
export const appRootAvailableValuesSelector = createSelector(appRootSelector, state => getAvailableFieldValues(state.gameField));
export const appRootMistakesSelector = createSelector(appRootSelector, state => state.mistakes);
export const appRootGameStartedAtSelector = createSelector(appRootSelector, state => new Date(state.startedAt));
export const appRootGameEndedAtSelector = createSelector(appRootSelector, state => new Date(state.endedAt));
export const appRootScoreSelector = createSelector(appRootSelector, state => state.score);
