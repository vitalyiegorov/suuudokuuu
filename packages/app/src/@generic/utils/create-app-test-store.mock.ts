import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { gameSlice } from '../../game/store/game.slice';
import { settingsSlice } from '../../settings/store/settings.slice';

import type { GameState } from '../../game/store/game.state';
import type { SettingsState } from '../../settings/store/settings.state';

const rootReducer = combineReducers({
    [gameSlice.name]: gameSlice.reducer,
    [settingsSlice.name]: settingsSlice.reducer
});

interface PreloadedAppState {
    readonly game?: Partial<GameState>;
    readonly settings?: Partial<SettingsState>;
}

export const createAppTestStore = (preloadedState: PreloadedAppState = {}) =>
    configureStore({
        reducer: rootReducer,
        middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
        preloadedState: {
            [gameSlice.name]: { ...gameSlice.getInitialState(), ...preloadedState.game },
            [settingsSlice.name]: { ...settingsSlice.getInitialState(), ...preloadedState.settings }
        }
    });
