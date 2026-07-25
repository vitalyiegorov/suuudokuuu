import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { appRootPersistor, appRootStore } from '../../app-root.store';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

const rootProvidersStyle = { flex: 1 };

export const RootProviders = ({ children }: Props) => (
    <GestureHandlerRootView style={rootProvidersStyle}>
        <Provider store={appRootStore}>
            <PersistGate loading={null} persistor={appRootPersistor} onBeforeLift={SplashScreen.hideAsync}>
                {children}
            </PersistGate>
        </Provider>
    </GestureHandlerRootView>
);
