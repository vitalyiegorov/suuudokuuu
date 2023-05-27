import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMigrate, persistReducer } from 'redux-persist';

import { historySlice } from './history.slice';

export const historyPersistMigration = createMigrate({});

export const historyReducer = persistReducer(
    {
        key: historySlice.name,
        storage: AsyncStorage,
        version: 2,
        migrate: historyPersistMigration
    },
    historySlice.reducer
) as unknown as typeof historySlice.reducer;
