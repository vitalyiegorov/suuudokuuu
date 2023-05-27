import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMigrate, persistReducer } from 'redux-persist';

import { gameSlice } from './game.slice';

export const gamePersistMigration = createMigrate({});

export const gameReducer = persistReducer(
    {
        key: gameSlice.name,
        storage: AsyncStorage,
        version: 2,
        migrate: gamePersistMigration
    },
    gameSlice.reducer
) as unknown as typeof gameSlice.reducer;
