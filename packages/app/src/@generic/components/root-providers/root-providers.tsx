import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { settingsLanguageSelector } from '../../../settings/store/settings.selectors';
import { appRootPersistor, appRootStore } from '../../app-root.store';
import { hideAppSplashScreen } from '../../utils/hide-app-splash-screen';
import { i18nActivateLanguage } from '../../utils/i18n-catalogs';
import { SafeAreaFloorProvider } from '../safe-area-floor-provider/safe-area-floor-provider';
import { SystemMotionProvider } from '../system-motion-provider/system-motion-provider';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

const rootProvidersStyle = { flex: 1 };

const handleBeforeLift = (): Promise<void> =>
    i18nActivateLanguage(settingsLanguageSelector(appRootStore.getState())).then(hideAppSplashScreen);

export const RootProviders = ({ children }: Props) => (
    <GestureHandlerRootView style={rootProvidersStyle}>
        <Provider store={appRootStore}>
            <PersistGate loading={null} persistor={appRootPersistor} onBeforeLift={handleBeforeLift}>
                <SafeAreaFloorProvider>
                    <SystemMotionProvider>{children}</SystemMotionProvider>
                </SafeAreaFloorProvider>
            </PersistGate>
        </Provider>
    </GestureHandlerRootView>
);
