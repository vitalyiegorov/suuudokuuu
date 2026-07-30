import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { initialCustomThemesState } from './custom-themes.state';

import type { CustomThemeInterface } from '../interface/custom-theme.interface';

export const customThemesSlice = createSlice({
    name: 'customThemes',
    initialState: initialCustomThemesState,
    reducers: {
        upsert: (state, action: PayloadAction<CustomThemeInterface>) => {
            const hasTheme = state.themes.some(theme => theme.id === action.payload.id);

            if (hasTheme) {
                state.themes = state.themes.map(theme => (theme.id === action.payload.id ? action.payload : theme));
            } else {
                state.themes = [...state.themes, action.payload];
            }
        },
        remove: (state, action: PayloadAction<Pick<CustomThemeInterface, 'id'>>) => {
            state.themes = state.themes.filter(theme => theme.id !== action.payload.id);
        }
    }
});
