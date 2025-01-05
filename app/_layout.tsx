import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Inter_500Medium, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { ThemeProvider } from '@react-navigation/native';
import { isDefined } from '@rnw-community/shared';

import { appRootPersistor, appRootStore } from '../src/@app-root';
import { BlackTheme, WhiteTheme } from '../src/@generic';

void SplashScreen.preventAutoHideAsync();

const stackOptions = { headerShown: false, gestureEnabled: false };

export default function RootLayout() {
    const scheme = useColorScheme() === 'dark' ? BlackTheme : WhiteTheme,
        [loaded, error] = useFonts({
            Inter_500Medium,
            Inter_700Bold
        });

    useEffect(() => {
        if (loaded || isDefined(error)) {
            void SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !isDefined(error)) {
        return null;
    }

    return (
        <Provider store={appRootStore}>
            <PersistGate loading={null} persistor={appRootPersistor}>
                <SafeAreaProvider>
                    <ThemeProvider value={scheme}>
                        <Stack screenOptions={stackOptions} />
                    </ThemeProvider>
                </SafeAreaProvider>
            </PersistGate>
        </Provider>
    );
}
