import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import { appRootPersistTransform, appRootReducer } from './app-root/app-root.reducer';
import { appRootSlice } from './app-root/app-root.slice';

// void AsyncStorage.clear();

const rootReducer = combineReducers({
    [appRootSlice.name]: appRootReducer
});
const persistedReducer = persistReducer(
    {
        key: 'root',
        storage: AsyncStorage,
        version: 1,
        transforms: [appRootPersistTransform]
    },
    rootReducer
) as unknown as typeof rootReducer;

export const appStore = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
});
export const appPersistor = persistStore(appStore);

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
