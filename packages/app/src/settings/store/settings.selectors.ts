import { createSelector } from '@reduxjs/toolkit';

import type { SettingsState } from './settings.state';
import type { RootState } from '../../@generic/app-root.store';

const settingsSelector = (state: RootState) => state.settings;

export const settingsKeySelector = (
    key: keyof Pick<SettingsState, 'hasVibration' | 'hasTimer' | 'showComboAnimation' | 'showAreas' | 'showIdenticalNumbers'>
) => createSelector(settingsSelector, state => state[key]);
export const settingsFontSizeSelector = createSelector(settingsSelector, state => state.fontSize);
export const settingsLanguageSelector = createSelector(settingsSelector, state => state.language);
export const settingsThemeSelector = createSelector(settingsSelector, state => state.theme);
