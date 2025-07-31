import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';

import { gameSlice } from '../game/store/game.slice';
import { initialGameState } from '../game/store/game.state';
import { historySlice } from '../history/store/history.slice';
import { initialHistoryState } from '../history/store/history.state';
import { settingsSlice } from '../settings/store/settings.slice';
import { initialSettingsState } from '../settings/store/settings.state';

import type { MigrationManifest } from 'redux-persist/es/types';

const migrations: MigrationManifest<RootState> = {
    5: state => ({ ...state, [gameSlice.name]: { ...initialGameState }, [historySlice.name]: { ...initialHistoryState } }),
    8: state => ({ ...state, [settingsSlice.name]: { ...initialSettingsState } })
};

const rootReducer = combineReducers({
    [gameSlice.name]: gameSlice.reducer,
    [historySlice.name]: historySlice.reducer,
    [settingsSlice.name]: settingsSlice.reducer
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const persistedReducer = persistReducer(
    {
        key: 'root',
        storage: AsyncStorage,
        version: 8,
        migrate: createMigrate(migrations)
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
