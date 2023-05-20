import { useFonts, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen, Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { createStore } from '../store/create-store';

const stackOptions = { headerShown: false };
export default function RootLayout() {
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
                <Stack screenOptions={stackOptions} />
            </SafeAreaProvider>
        </Provider>
    );
}
