import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { initialSettingsState } from './settings.state';

import type { SettingsState } from './settings.state';

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialSettingsState,
    reducers: {
        set: (state, action: PayloadAction<Partial<SettingsState>>) => {
            Object.assign(state, action.payload);
        }
    }
});
