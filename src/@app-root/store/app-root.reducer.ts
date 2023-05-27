import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMigrate, persistReducer } from 'redux-persist';

import { appRootSlice } from './app-root.slice';

export const appRootPersistMigration = createMigrate({});

export const appRootReducer = persistReducer(
    {
        key: appRootSlice.name,
        storage: AsyncStorage,
        version: 2,
        migrate: appRootPersistMigration
    },
    appRootSlice.reducer
) as unknown as typeof appRootSlice.reducer;
