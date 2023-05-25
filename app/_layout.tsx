import { Inter_500Medium, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { BlackTheme, WhiteTheme } from '../components/theme';
import { appPersistor, appStore } from '../store/app.store';

const stackOptions = { headerShown: false };

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
        <Provider store={appStore}>
            <PersistGate loading={null} persistor={appPersistor}>
                <SafeAreaProvider>
                    <ThemeProvider value={scheme}>
                        <Stack screenOptions={stackOptions} />
                    </ThemeProvider>
                </SafeAreaProvider>
            </PersistGate>
        </Provider>
    );
}
