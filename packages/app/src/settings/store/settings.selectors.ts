import { createSelector } from '@reduxjs/toolkit';

import type { SettingsState } from './settings.state';
import type { RootState } from '../../@generic/app-root.store';

const settingsSelector = (state: RootState) => state.settings;

export const settingsKeySelector = (key: keyof Omit<SettingsState, 'fontSize'>) => createSelector(settingsSelector, state => state[key]);
