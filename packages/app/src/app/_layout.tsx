import { Inter_500Medium as inter500Medium, Inter_700Bold as inter700Bold, useFonts } from '@expo-google-fonts/inter';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { enableFreeze, enableScreens } from 'react-native-screens';

import { isDefined } from '@rnw-community/shared';

import { LinguiDefaultComponent } from '../@generic/components/lingui-default-component/lingui-default-component';
import { RootProviders } from '../@generic/components/root-providers/root-providers';
import { applySheetContentWidth } from '../@generic/utils/apply-sheet-content-width';
import { i18nGetOSLocale } from '../@generic/utils/i18n.util';
import { WinConfettiProvider } from '../confetti/components/win-confetti-provider/win-confetti-provider';
import { GameProvider } from '../game/components/game-provider/game-provider';
import { ThemeProvider } from '../theme/components/theme-provider/theme-provider';

enableScreens();
enableFreeze();
applySheetContentWidth();

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
        <RootProviders>
            <ThemeProvider>
                <I18nProvider i18n={i18n} defaultComponent={LinguiDefaultComponent}>
                    <GameProvider>
                        <WinConfettiProvider>
                            <Stack screenOptions={stackOptions}>
                                <Stack.Screen name="game" options={gameOptions} />
                                <Stack.Screen name="settings/[setting]" options={settingsOptionSheetOptions} />
                            </Stack>
                        </WinConfettiProvider>
                    </GameProvider>
                </I18nProvider>
            </ThemeProvider>
        </RootProviders>
    );
}
