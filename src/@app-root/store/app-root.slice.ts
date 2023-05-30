import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { DifficultyEnum } from '../../@generic';

import { appRootInitialState } from './app-root.state';

export const appRootSlice = createSlice({
    name: 'appRoot',
    initialState: appRootInitialState,
    reducers: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        load: (_state, _action: PayloadAction<DifficultyEnum>) => {}
    }
});
