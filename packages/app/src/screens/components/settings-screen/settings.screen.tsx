import { useLingui } from '@lingui/react/macro';
import { AppSettingsSection } from '@suuudokuuu/ui';
import Constants from 'expo-constants';

import { ReturnableScreenChromeCompactBottomContentPreset } from '../../../@generic/components/returnable-screen-chrome/constant/returnable-screen-chrome.constant';
import { ReturnableScreenChrome } from '../../../@generic/components/returnable-screen-chrome/returnable-screen-chrome';
import { ReturnableScreenScrollView } from '../../../@generic/components/returnable-screen-scroll-view/returnable-screen-scroll-view';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { SettingsAppFooter } from '../../../settings/component/settings-app-footer/settings-app-footer';
import { SettingsGuidanceSection } from '../../../settings/component/settings-guidance-section/settings-guidance-section';
import { SettingsOptionLink } from '../../../settings/component/settings-option-link/settings-option-link';
import { SettingsSwitch } from '../../../settings/component/settings-switch/settings-switch';
import { useSettingsOptionLabels } from '../../../settings/hooks/use-settings-option-labels.hook';
import {
    settingsCellMarginSelector,
    settingsFontSizeSelector,
    settingsLanguageSelector,
    settingsThemeSelector
} from '../../../settings/store/settings.selectors';

import { SettingsScreenSelectors } from './settings-screen.selectors';
import { SettingsScreenStyles as styles } from './settings-screen.styles';

export const SettingsScreen = () => {
    const { t } = useLingui();
    const cellMargin = useAppSelector(settingsCellMarginSelector);
    const fontSize = useAppSelector(settingsFontSizeSelector);
    const language = useAppSelector(settingsLanguageSelector);
    const theme = useAppSelector(settingsThemeSelector);
    const { getCellMarginLabel, getFontSizeLabel, getLanguageLabel, getThemeLabel } = useSettingsOptionLabels();
    const version = Constants.expoConfig?.version ?? t`Unknown`;

    return (
        <ReturnableScreenChrome contentStyle={styles.content} title={t`Settings`}>
            <ReturnableScreenScrollView
                bottomContentPreset={ReturnableScreenChromeCompactBottomContentPreset}
                contentContainerStyle={styles.scrollViewContent}
                style={styles.scrollView}
                testID={SettingsScreenSelectors.Root}
            >
                <AppSettingsSection title={t`Game`}>
                    <SettingsOptionLink
                        description={t`Menus, settings, and game text`}
                        href="/settings/language"
                        title={t`Language`}
                        value={getLanguageLabel(language)}
                    />
                    <SettingsOptionLink
                        description={t`Adjust the digits on the Sudoku board`}
                        href="/settings/font-size"
                        title={t`Number size`}
                        value={getFontSizeLabel(fontSize)}
                    />
                    <SettingsOptionLink
                        description={t`Space between Sudoku cells`}
                        href="/settings/cell-margin"
                        testID={SettingsScreenSelectors.CellSpacingOption}
                        title={t`Cell spacing`}
                        value={getCellMarginLabel(cellMargin)}
                    />
                </AppSettingsSection>
                <AppSettingsSection title={t`Display`}>
                    <SettingsOptionLink
                        description={t`Board colors and screen appearance`}
                        href="/settings/theme"
                        title={t`Theme`}
                        value={getThemeLabel(theme)}
                    />
                    <SettingsSwitch description={t`Use a dark color scheme`} setting="isDarkColorSchema" title={t`Dark mode`} />
                </AppSettingsSection>
                <AppSettingsSection title={t`Feedback`}>
                    <SettingsSwitch description={t`Show elapsed time while you play`} setting="hasTimer" title={t`Timer`} />
                    <SettingsSwitch description={t`Vibrate on taps and game actions`} setting="hasVibration" title={t`Vibration`} />
                </AppSettingsSection>

                <SettingsGuidanceSection />

                <SettingsAppFooter version={version} />
            </ReturnableScreenScrollView>
        </ReturnableScreenChrome>
    );
};
