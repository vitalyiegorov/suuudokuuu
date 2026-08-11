import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { settingsApplyComfortMode } from '../utils/settings-apply-comfort-mode.util';
import { settingsIsComfortModeApplied } from '../utils/settings-is-comfort-mode-applied.util';
import { settingsRestoreComfortMode } from '../utils/settings-restore-comfort-mode.util';

import { initialSettingsState } from './settings.state';

import type { SettingsState } from './settings.state';

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialSettingsState,
    reducers: {
        set: (state, action: PayloadAction<Partial<SettingsState>>) => {
            Object.assign(state, action.payload);

            if (state.comfortMode !== 'off') {
                state.comfortMode = settingsIsComfortModeApplied(state) ? 'on' : 'customized';
            }
        },
        setComfortMode: (state, action: PayloadAction<boolean>) => {
            Object.assign(state, action.payload ? settingsApplyComfortMode(state) : settingsRestoreComfortMode(state));
        }
    }
});
