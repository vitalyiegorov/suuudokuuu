import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AsyncStorage from 'expo-sqlite/kv-store';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';

import { gameSlice } from '../game/store/game.slice';
import { initialGameState } from '../game/store/game.state';
import { emptyGameHistory } from '../history/interfaces/history-game.interface';
import { settingsSlice } from '../settings/store/settings.slice';
import { initialSettingsState } from '../settings/store/settings.state';

import type { GameState } from '../game/store/game.state';
import type { MigrationManifest } from 'redux-persist/es/types';

const resetBestScores = (state: RootState): RootState => {
    const gameState = state[gameSlice.name];
    const resetHistory = { ...gameState.historyByDifficulty };

    Object.keys(resetHistory).forEach(key => {
        resetHistory[key as keyof typeof resetHistory].bestScore = 0;
    });

    return {
        ...state,
        [gameSlice.name]: { ...gameState, historyByDifficulty: resetHistory }
    };
};

const ensureHistoryEntryDefaults = (state: RootState): RootState => {
    const gameState = state[gameSlice.name];
    const updatedHistory = { ...gameState.historyByDifficulty };

    Object.keys(updatedHistory).forEach(key => {
        const historyEntry = updatedHistory[key as keyof typeof updatedHistory];
        updatedHistory[key as keyof typeof updatedHistory] = {
            ...emptyGameHistory,
            ...historyEntry
        };
    });

    return {
        ...state,
        [gameSlice.name]: { ...gameState, historyByDifficulty: updatedHistory }
    };
};

const ensureAllDifficulties = (state: RootState): RootState => {
    const gameState = state[gameSlice.name];

    return {
        ...state,
        [gameSlice.name]: {
            ...gameState,
            historyByDifficulty: {
                ...initialGameState.historyByDifficulty,
                ...gameState.historyByDifficulty
            }
        }
    };
};

const migrations: MigrationManifest<RootState> = {
    12: state => ({
        ...state,
        [gameSlice.name]: {
            ...initialGameState,
            ...state[gameSlice.name],
            historyByDifficulty: {
                ...initialGameState.historyByDifficulty,
                // @ts-expect-error Migrating old state
                // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access
                ...(state.history?.byDifficulty as unknown as GameState['historyByDifficulty'])
            }
        }
    }),
    13: state => ({ ...state, [gameSlice.name]: { ...initialGameState, ...state[gameSlice.name] } }),
    14: state => ({ ...state, [settingsSlice.name]: { ...initialSettingsState, ...state[settingsSlice.name] } }),
    15: resetBestScores,
    16: ensureHistoryEntryDefaults,
    17: ensureAllDifficulties,
    18: ensureHistoryEntryDefaults,
    19: state => ({ ...state, [settingsSlice.name]: { ...initialSettingsState, ...state[settingsSlice.name] } }),
    20: state => ({ ...state, [settingsSlice.name]: { ...initialSettingsState, ...state[settingsSlice.name] } }),
    21: state => ({ ...state, [settingsSlice.name]: { ...initialSettingsState, ...state[settingsSlice.name] } }),
    22: state => ({ ...state, [gameSlice.name]: { ...initialGameState, ...state[gameSlice.name] } }),
    23: state => ({ ...state, [gameSlice.name]: { ...initialGameState, ...state[gameSlice.name] } })
};

const rootReducer = combineReducers({
    [gameSlice.name]: gameSlice.reducer,
    [settingsSlice.name]: settingsSlice.reducer
});

const persistedReducer = persistReducer(
    {
        key: 'root',
        storage: AsyncStorage,
        timeout: 0,
        version: 23,
        migrate: createMigrate(migrations)
    },
    rootReducer
) as unknown as typeof rootReducer;

export const appRootStore = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
});
persistStore(appRootStore);

export type RootState = ReturnType<typeof appRootStore.getState>;
export type AppDispatch = typeof appRootStore.dispatch;
