import { SplashScreen, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Inter_500Medium, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { ThemeProvider } from '@react-navigation/native';

import { appRootPersistor, appRootStore } from '../src/@app-root';
import { BlackTheme, WhiteTheme } from '../src/@generic';

const stackOptions = { headerShown: false, gestureEnabled: false };

export default function RootLayout() {
    const scheme = useColorScheme() === 'dark' ? BlackTheme : WhiteTheme;
    const [fontsLoaded] = useFonts({
        Inter_500Medium,
        Inter_700Bold
    });

    if (!fontsLoaded) {
        return <SplashScreen />;
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
