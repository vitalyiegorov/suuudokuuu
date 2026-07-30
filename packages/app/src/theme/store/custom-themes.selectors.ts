import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../../@generic/app-root.store';

const customThemesStateSelector = (state: RootState) => state.customThemes;

export const customThemesSelector = createSelector(customThemesStateSelector, state => state.themes);
