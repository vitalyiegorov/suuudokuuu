import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMigrate, createTransform, persistReducer } from 'redux-persist';

import { type PersistedGameStateInterface } from '../../interfaces/game-state.interface';

import { appRootSlice } from './app-root.slice';
import { type AppRootState } from './app-root.state';

export const appRootPersistTransform = createTransform<AppRootState, PersistedGameStateInterface>(
    inbound => ({ ...inbound, calculatedAt: inbound.calculatedAt.toString(), startedAt: inbound.startedAt.toString() }),
    outbound => {
        // TODO: Transform does not work - we cannot make dates in the store
        return {
            ...outbound,
            calculatedAt: new Date(outbound.calculatedAt),
            startedAt: new Date(outbound.startedAt)
        };
    },
    { whitelist: [appRootSlice.name] }
);

export const appRootPersistMigration = createMigrate({
    // @ts-expect-error Wrong typing
    2: state => {
        return {
            ...state,
            startedAt: new Date()
        };
    }
});

export const appRootReducer = persistReducer(
    {
        key: appRootSlice.name,
        storage: AsyncStorage,
        version: 2,
        migrate: appRootPersistMigration
    },
    appRootSlice.reducer
) as unknown as typeof appRootSlice.reducer;
