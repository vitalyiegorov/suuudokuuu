import { persistReducer, persistStore } from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { gameReducer, gameSlice } from '../../game';
import { historyReducer, historySlice } from '../../history';

import { appRootReducer } from './app-root.reducer';
import { appRootSlice } from './app-root.slice';

const rootReducer = combineReducers({
    [appRootSlice.name]: appRootReducer,
    [gameSlice.name]: gameReducer,
    [historySlice.name]: historyReducer
});

const persistedReducer = persistReducer(
    {
        key: 'root',
        storage: AsyncStorage,
        version: 1
    },
    rootReducer
) as unknown as typeof rootReducer;

export const appRootStore = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
});
export const appRootPersistor = persistStore(appRootStore);

export type RootState = ReturnType<typeof appRootStore.getState>;
export type AppDispatch = typeof appRootStore.dispatch;
