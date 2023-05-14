import { configureStore } from '@reduxjs/toolkit';

import { appRootSlice } from './app-root/app-root.slice';

export const createStore = configureStore({
    reducer: {
        appRoot: appRootSlice.reducer
    }
});

export type RootState = ReturnType<typeof createStore.getState>;
export type AppDispatch = typeof createStore.dispatch;
