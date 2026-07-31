import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AsyncStorage from 'expo-sqlite/kv-store';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';

import { gameSlice } from '../game/store/game.slice';
import { hellQueueSlice } from '../hell-queue/store/hell-queue.slice';
import { settingsSlice } from '../settings/store/settings.slice';
import { customThemesSlice } from '../theme/store/custom-themes.slice';

import { appRootMigrations, appRootPersistVersion } from './app-root-migrations';

const rootReducer = combineReducers({
    [gameSlice.name]: gameSlice.reducer,
    [settingsSlice.name]: settingsSlice.reducer,
    [customThemesSlice.name]: customThemesSlice.reducer,
    [hellQueueSlice.name]: hellQueueSlice.reducer
});

const persistedReducer = persistReducer(
    {
        key: 'root',
        storage: AsyncStorage,
        version: appRootPersistVersion,
        migrate: createMigrate(appRootMigrations)
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
