import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';

import { gameSlice } from '../game/store/game.slice';
import { initialGameState } from '../game/store/game.state';
import { settingsSlice } from '../settings/store/settings.slice';

import type { GameState } from '../game/store/game.state';
import type { MigrationManifest } from 'redux-persist/es/types';

const migrations: MigrationManifest<RootState> = {
    10: state => ({
        ...state,
        [gameSlice.name]: {
            ...initialGameState,
            ...state[gameSlice.name],
            historyByDifficulty: {
                ...initialGameState.historyByDifficulty,
                // @ts-expect-error Migrating old state
                // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-type-assertion
                ...(state.history?.byDifficulty as unknown as GameState['historyByDifficulty'])
            }
        }
    })
};

const rootReducer = combineReducers({
    [gameSlice.name]: gameSlice.reducer,
    [settingsSlice.name]: settingsSlice.reducer
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const persistedReducer = persistReducer(
    {
        key: 'root',
        storage: AsyncStorage,
        version: 10,
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
