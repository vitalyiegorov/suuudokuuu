import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type DifficultyEnum } from '../../@generic';

import { appRootInitialState } from './app-root.state';

export const appRootSlice = createSlice({
    name: 'appRoot',
    initialState: appRootInitialState,
    reducers: {
        load: (_state, _action: PayloadAction<DifficultyEnum>) => {}
    }
});
