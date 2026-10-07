import { Inter_500Medium as inter500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_700Bold as inter700Bold } from '@expo-google-fonts/inter/700Bold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Platform } from 'react-native';
import { enableFreeze, enableScreens } from 'react-native-screens';

import { isDefined } from '@rnw-community/shared';

import { AppI18nProvider } from '../@generic/components/app-i18n-provider/app-i18n-provider';
import { RootProviders } from '../@generic/components/root-providers/root-providers';
import { applyGameControlsInteractions } from '../@generic/utils/apply-game-controls-interactions';
import { applySheetContentWidth } from '../@generic/utils/apply-sheet-content-width';
import { WinConfettiProvider } from '../confetti/components/win-confetti-provider/win-confetti-provider';
import { GameProvider } from '../game/components/game-provider/game-provider';
import { ThemeProvider } from '../theme/components/theme-provider/theme-provider';

if (Platform.OS !== 'web') {
    enableScreens();
    enableFreeze();
}
applySheetContentWidth();
applyGameControlsInteractions();

void SplashScreen.preventAutoHideAsync();

const stackOptions = { headerShown: false, gestureEnabled: true };
const gameOptions = { gestureEnabled: false };
const modalSheetOptions = {
    animation: 'fade' as const,
    contentStyle: { backgroundColor: 'transparent' },
    gestureEnabled: false,
    presentation: 'transparentModal' as const
};

export default function RootLayout() {
    const [loaded, error] = useFonts({ Inter_500Medium: inter500Medium, Inter_700Bold: inter700Bold });
    const areFontsReady = loaded || isDefined(error) || Platform.OS === 'web';

    if (!areFontsReady) {
        return null;
    }

    return (
        <RootProviders>
            <ThemeProvider>
                <AppI18nProvider>
                    <GameProvider>
                        <WinConfettiProvider>
                            <Stack screenOptions={stackOptions}>
                                <Stack.Screen dangerouslySingular name="game" options={gameOptions} />
                                <Stack.Screen name="settings/[setting]" options={modalSheetOptions} />
                                <Stack.Screen name="rating-explainer/[rating]" options={modalSheetOptions} />
                            </Stack>
                        </WinConfettiProvider>
                    </GameProvider>
                </AppI18nProvider>
            </ThemeProvider>
        </RootProviders>
    );
}
