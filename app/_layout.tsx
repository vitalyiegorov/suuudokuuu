import { Inter_500Medium, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { BlackTheme, WhiteTheme } from '../components/theme';
import { createStore } from '../store/create-store';

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
        <Provider store={createStore}>
            <SafeAreaProvider>
                <ThemeProvider value={scheme}>
                    <Stack screenOptions={stackOptions} />
                </ThemeProvider>
            </SafeAreaProvider>
        </Provider>
    );
}
