import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { enableFreeze, enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Inter_500Medium, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { ThemeProvider } from '@react-navigation/native';

import { appRootPersistor, appRootStore } from '../@generic/app-root.store';
import { BlackTheme, WhiteTheme } from '../@generic/styles/theme';

enableScreens();
enableFreeze();
void SplashScreen.preventAutoHideAsync();

const stackOptions = { headerShown: false, gestureEnabled: false };

export default function RootLayout() {
    const scheme = useColorScheme() === 'dark' ? BlackTheme : WhiteTheme;
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
                <ThemeProvider value={scheme}>
                    <Stack screenOptions={stackOptions} />
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}
