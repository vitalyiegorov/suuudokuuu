import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import { appRootReducer } from './app-root/app-root.reducer';
import { appRootSlice } from './app-root/app-root.slice';
import { historyReducer } from './history/history.reducer';
import { historySlice } from './history/history.slice';

// void AsyncStorage.clear();

const rootReducer = combineReducers({
    [appRootSlice.name]: appRootReducer,
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

export const appStore = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
});
export const appPersistor = persistStore(appStore);

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
