import { useFonts, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen, Stack } from 'expo-router';
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
            <Stack screenOptions={stackOptions} />
        </Provider>
    );
}
