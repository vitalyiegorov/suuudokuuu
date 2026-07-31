import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { gameSlice } from '../../game/store/game.slice';
import { hellQueueSlice } from '../../hell-queue/store/hell-queue.slice';
import { settingsSlice } from '../../settings/store/settings.slice';

import type { GameState } from '../../game/store/game.state';
import type { HellQueueState } from '../../hell-queue/store/hell-queue.state';
import type { SettingsState } from '../../settings/store/settings.state';

const rootReducer = combineReducers({
    [gameSlice.name]: gameSlice.reducer,
    [hellQueueSlice.name]: hellQueueSlice.reducer,
    [settingsSlice.name]: settingsSlice.reducer
});

interface PreloadedAppState {
    readonly game?: Partial<GameState>;
    readonly hellQueue?: Partial<HellQueueState>;
    readonly settings?: Partial<SettingsState>;
}

export const createAppTestStore = (preloadedState: PreloadedAppState = {}) =>
    configureStore({
        reducer: rootReducer,
        middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
        preloadedState: {
            [gameSlice.name]: { ...gameSlice.getInitialState(), ...preloadedState.game },
            [hellQueueSlice.name]: { ...hellQueueSlice.getInitialState(), ...preloadedState.hellQueue },
            [settingsSlice.name]: { ...settingsSlice.getInitialState(), ...preloadedState.settings }
        }
    });
