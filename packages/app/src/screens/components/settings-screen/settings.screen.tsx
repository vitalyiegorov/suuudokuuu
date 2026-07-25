import { useLingui } from '@lingui/react/macro';
import { AppSettingsSection, useAppLayout } from '@suuudokuuu/ui';
import Constants from 'expo-constants';
import { View } from 'react-native';

import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { resolveUnistyleForAnimated } from '../../../@generic/utils/resolve-unistyle-for-animated.util';
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
    const { sizeClass } = useAppLayout();
    const version = Constants.expoConfig?.version ?? t`Unknown`;

    return (
        <CollapsibleChromePage
            contentContainerStyle={resolveUnistyleForAnimated(styles.scrollViewContent(sizeClass))}
            contentStyle={styles.content}
            style={resolveUnistyleForAnimated(styles.scrollView(sizeClass))}
            testID={SettingsScreenSelectors.Root}
            title={t`Settings`}
        >
            <View style={styles.primaryColumn}>
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
            </View>

            <View style={styles.secondaryColumn(sizeClass)}>
                <SettingsGuidanceSection />

                <SettingsAppFooter version={version} />
            </View>
        </CollapsibleChromePage>
    );
};
