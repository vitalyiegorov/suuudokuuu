// eslint-disable-next-line camelcase
import { Inter_500Medium, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { enableFreeze, enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { appRootPersistor, appRootStore } from '../@generic/app-root.store';
import { BlackTheme, WhiteTheme } from '../@generic/styles/theme';
import { i18nGetOSLocale } from '../@generic/utils/i18n.util';
import { GameProvider } from '../game/context/game.context';

enableScreens();
enableFreeze();

i18n.activate(i18nGetOSLocale());

void SplashScreen.preventAutoHideAsync();

const stackOptions = { headerShown: false, gestureEnabled: false };

export default function RootLayout() {
    const theme = useColorScheme() === 'dark' ? BlackTheme : WhiteTheme;
    // eslint-disable-next-line camelcase
    const [loaded] = useFonts({ Inter_500Medium, Inter_700Bold });

    useEffect(() => {
        if (loaded) {
            void SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <Provider store={appRootStore}>
            <PersistGate loading={null} persistor={appRootPersistor}>
                <ThemeProvider value={theme}>
                    <I18nProvider i18n={i18n}>
                        <GameProvider>
                            {/* eslint-disable-next-line react/jsx-max-depth */}
                            <Stack screenOptions={stackOptions} />
                        </GameProvider>
                    </I18nProvider>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}
