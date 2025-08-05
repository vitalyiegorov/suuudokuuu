import { createSelector } from '@reduxjs/toolkit';

import type { SettingsState } from './settings.state';
import type { RootState } from '../../@generic/app-root.store';

const settingsSelector = (state: RootState) => state.settings;

export const settingsKeySelector = (
    key: keyof Pick<
        SettingsState,
        | 'hasVibration'
        | 'hasTimer'
        | 'showComboAnimation'
        | 'showAreas'
        | 'showIdenticalNumbers'
        | 'isDarkColorSchema'
        | 'showFilledNumbers'
        | 'showActiveCandidates'
    >
) => createSelector(settingsSelector, state => state[key]);
export const settingsFontSizeSelector = createSelector(settingsSelector, state => state.fontSize);
export const settingsFontSizeMultiplierSelector = createSelector(
    settingsSelector,
    // eslint-disable-next-line id-length
    state => ({ xs: 0.6, s: 0.8, m: 1.25, xl: 1.75 })[state.fontSize]
);
export const settingsLanguageSelector = createSelector(settingsSelector, state => state.language);
export const settingsThemeSelector = createSelector(settingsSelector, state => state.theme);
