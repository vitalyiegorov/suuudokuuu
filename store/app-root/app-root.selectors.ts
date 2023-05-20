import { createSelector } from '@reduxjs/toolkit';

import { getAvailableFieldValues } from '../../utils/get-available-field-values.util';
import { type RootState } from '../create-store';

const appRootSelector = (state: RootState) => state.appRoot;

export const appRootFieldSelector = createSelector(appRootSelector, state => state.gameField);
export const appRootSelectedCellSelector = createSelector(appRootSelector, state => state.selectedCell);
export const appRootSelectedValueSelector = createSelector(appRootSelector, state => state.selectedValue);
export const appRootAvailableValuesSelector = createSelector(appRootSelector, state => getAvailableFieldValues(state.gameField));
export const appRootMistakesSelector = createSelector(appRootSelector, state => state.mistakes);
