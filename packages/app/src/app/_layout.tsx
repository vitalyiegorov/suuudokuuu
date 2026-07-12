import { Inter_500Medium as inter500Medium, Inter_700Bold as inter700Bold, useFonts } from '@expo-google-fonts/inter';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { enableFreeze, enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { isDefined } from '@rnw-community/shared';

import { appRootPersistor, appRootStore } from '../@generic/app-root.store';
import { LinguiDefaultComponent } from '../@generic/components/lingui-default-component/lingui-default-component';
import { i18nGetOSLocale } from '../@generic/utils/i18n.util';
import { GameProvider } from '../game/components/game-provider/game-provider';
import { ThemeProvider } from '../theme/components/theme-provider/theme-provider';

enableScreens();
enableFreeze();

i18n.activate(i18nGetOSLocale());

void SplashScreen.preventAutoHideAsync();

const stackOptions = { headerShown: false, gestureEnabled: true };
const gameOptions = { gestureEnabled: false };
const settingsOptionSheetOptions = {
    animation: 'fade' as const,
    contentStyle: { backgroundColor: 'transparent' },
    gestureEnabled: false,
    presentation: 'transparentModal' as const
};

export default function RootLayout() {
    const [loaded, error] = useFonts({ Inter_500Medium: inter500Medium, Inter_700Bold: inter700Bold });
    const areFontsReady = loaded || isDefined(error);

    if (!areFontsReady) {
        return null;
    }

    return (
        <Provider store={appRootStore}>
            <PersistGate loading={null} persistor={appRootPersistor} onBeforeLift={SplashScreen.hideAsync}>
                <ThemeProvider>
                    <I18nProvider i18n={i18n} defaultComponent={LinguiDefaultComponent}>
                        <GameProvider>
                            <Stack screenOptions={stackOptions}>
                                <Stack.Screen name="game" options={gameOptions} />
                                <Stack.Screen name="settings/[setting]" options={settingsOptionSheetOptions} />
                            </Stack>
                        </GameProvider>
                    </I18nProvider>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}
