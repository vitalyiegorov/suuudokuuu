import BottomSheet, { BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { SettingsOptionSheet } from '../../../settings/component/settings-option-sheet/settings-option-sheet';
import { useSettingsOptionSheetConfig } from '../../../settings/hooks/use-settings-option-sheet-config.hook';
import { settingsOptionSheetGetAllowedDetents } from '../../../settings/utils/settings-option-sheet-get-allowed-detents.util';
import { settingsOptionSheetGetColors } from '../../../settings/utils/settings-option-sheet-get-colors.util';
import { settingsOptionSheetGetSnapPoint } from '../../../settings/utils/settings-option-sheet-get-snap-point.util';

import { SettingsOptionSheetScreenStyles as styles } from './settings-option-sheet-screen.styles';

export const SettingsOptionSheetScreen = () => {
    const { theme } = useUnistyles();
    const { height } = useWindowDimensions();
    const params = useLocalSearchParams<{ setting?: string | string[] }>();
    const setting = Array.isArray(params.setting) ? null : (params.setting ?? null);
    const config = useSettingsOptionSheetConfig(setting);

    useEffect(() => {
        if (isNotEmptyString(setting) && !isDefined(config)) {
            router.back();
        }
    }, [setting, config]);

    if (!isDefined(config)) {
        return null;
    }

    const sheetAllowedDetents = settingsOptionSheetGetAllowedDetents(config.items.length, height);
    const sheetSnapPoints = sheetAllowedDetents.map(settingsOptionSheetGetSnapPoint);
    const sheetBackgroundStyle = {
        backgroundColor: settingsOptionSheetGetColors(theme).panelBackground,
        marginLeft: 'auto' as const,
        marginRight: 'auto' as const,
        maxWidth: theme.contentWidth.standard
    };

    return (
        <>
            <Stack.Screen />
            <BottomSheet
                backgroundStyle={sheetBackgroundStyle}
                enableDynamicSizing={false}
                enablePanDownToClose
                index={0}
                onClose={router.back}
                snapPoints={sheetSnapPoints}
            >
                <BottomSheetView style={styles.sheetContent}>
                    <SettingsOptionSheet description={config.description} items={config.items} title={config.title} />
                </BottomSheetView>
            </BottomSheet>
        </>
    );
};
