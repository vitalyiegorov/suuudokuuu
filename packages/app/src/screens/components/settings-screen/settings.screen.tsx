import { useLingui } from '@lingui/react/macro';
import { AppSettingsSection, resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import Constants from 'expo-constants';
import { View } from 'react-native';

import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { SettingsAppFooter } from '../../../settings/component/settings-app-footer/settings-app-footer';
import { SettingsComfortModeSection } from '../../../settings/component/settings-comfort-mode-section/settings-comfort-mode-section';
import { SettingsFeedbackSection } from '../../../settings/component/settings-feedback-section/settings-feedback-section';
import { SettingsGuidanceSection } from '../../../settings/component/settings-guidance-section/settings-guidance-section';
import { SettingsOptionLink } from '../../../settings/component/settings-option-link/settings-option-link';
import { SettingsSwitch } from '../../../settings/component/settings-switch/settings-switch';
import { useSettingsOptionLabels } from '../../../settings/hooks/use-settings-option-labels.hook';
import {
    settingsCellMarginSelector,
    settingsFontSizeSelector,
    settingsLanguageSelector,
    settingsMotionPreferenceSelector,
    settingsThemeSelector
} from '../../../settings/store/settings.selectors';

import { SettingsScreenSelectors } from './settings-screen.selectors';
import { SettingsScreenStyles as styles } from './settings-screen.styles';

export const SettingsScreen = () => {
    const { t } = useLingui();
    const cellMargin = useAppSelector(settingsCellMarginSelector);
    const fontSize = useAppSelector(settingsFontSizeSelector);
    const language = useAppSelector(settingsLanguageSelector);
    const motionPreference = useAppSelector(settingsMotionPreferenceSelector);
    const theme = useAppSelector(settingsThemeSelector);
    const { getCellMarginLabel, getFontSizeLabel, getLanguageLabel, getMotionPreferenceLabel, getThemeLabel } = useSettingsOptionLabels();
    const version = Constants.expoConfig?.version ?? t`Unknown`;

    return (
        <CollapsibleChromePage
            contentContainerStyle={resolveUnistyleForAnimated(styles.scrollViewContent)}
            contentStyle={styles.content}
            style={resolveUnistyleForAnimated(styles.scrollView)}
            testID={SettingsScreenSelectors.Root}
            title={t`Settings`}
        >
            <View style={styles.primaryColumn}>
                <SettingsComfortModeSection />

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
                    <SettingsSwitch
                        description={t`Dim a completed digit in the numpad instead of removing it`}
                        setting="keepExhaustedDigits"
                        title={t`Keep completed digits`}
                    />
                </AppSettingsSection>
                <AppSettingsSection title={t`Display`}>
                    <SettingsOptionLink
                        description={t`Board colors and screen appearance`}
                        href="/settings/themes"
                        testID={SettingsScreenSelectors.ThemeOption}
                        title={t`Theme`}
                        value={getThemeLabel(theme)}
                    />
                    <SettingsSwitch
                        description={t`Use a dark color scheme`}
                        setting="isDarkColorSchema"
                        testID={SettingsScreenSelectors.DarkModeSwitch}
                        title={t`Dark mode`}
                    />
                    <SettingsSwitch
                        description={t`Move the landscape controls panel to the left of the board`}
                        setting="isLeftHanded"
                        title={t`Left-handed layout`}
                    />
                    <SettingsOptionLink
                        description={t`How much the board and screens may move`}
                        href="/settings/motion"
                        testID={SettingsScreenSelectors.MotionOption}
                        title={t`Animations`}
                        value={getMotionPreferenceLabel(motionPreference)}
                    />
                </AppSettingsSection>
                <SettingsFeedbackSection />
            </View>

            <View style={styles.secondaryColumn}>
                <SettingsGuidanceSection />

                <SettingsAppFooter version={version} />
            </View>
        </CollapsibleChromePage>
    );
};
