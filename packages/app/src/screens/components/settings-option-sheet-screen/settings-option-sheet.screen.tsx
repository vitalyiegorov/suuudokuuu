import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { SheetFrame } from '../../../@generic/components/sheet-frame/sheet-frame';
import { HomeHrefConstant } from '../../../@generic/constants/home-href.constant';
import { SettingsOptionSheet } from '../../../settings/component/settings-option-sheet/settings-option-sheet';
import { useSettingsOptionSheetConfig } from '../../../settings/hooks/use-settings-option-sheet-config.hook';
import { settingsOptionSheetGetAllowedDetents } from '../../../settings/utils/settings-option-sheet-get-allowed-detents.util';

export const SettingsOptionSheetScreen = () => {
    const { height } = useWindowDimensions();
    const params = useLocalSearchParams<{ setting?: string | string[] }>();
    const setting = Array.isArray(params.setting) ? null : (params.setting ?? null);
    const config = useSettingsOptionSheetConfig(setting);

    const canGoBack = router.canGoBack();

    useEffect(() => {
        if (!isDefined(config) && canGoBack) {
            router.back();
        }
    }, [config, canGoBack]);

    if (!isDefined(config)) {
        return canGoBack ? null : <Redirect href={HomeHrefConstant} />;
    }

    return (
        <SheetFrame accessibilityLabel={config.title} detents={settingsOptionSheetGetAllowedDetents(config.items.length, height)}>
            <SettingsOptionSheet description={config.description} items={config.items} title={config.title} />
        </SheetFrame>
    );
};
