import { useLingui } from '@lingui/react/macro';
import { AppSettingsRow, AppSettingsSection, AppToggle } from '@suuudokuuu/ui';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { use } from 'react';
import { View } from 'react-native';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { useVibration } from '../../../@generic/hooks/use-vibration.hook';
import { SettingsScreenSelectors } from '../../../screens/components/settings-screen/settings-screen.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { settingsSetComfortModeAction } from '../../store/settings.actions';
import { settingsComfortModeSelector } from '../../store/settings.selectors';

import { SettingsComfortModeSectionStyles as styles } from './settings-comfort-mode-section.styles';

export const SettingsComfortModeSection = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const comfortMode = useAppSelector(settingsComfortModeSelector);
    const dispatch = useAppDispatch();
    const [, hapticImpact] = useVibration();

    const handleValueChange = (newValue: boolean) => {
        hapticImpact(ImpactFeedbackStyle.Light);
        dispatch(settingsSetComfortModeAction(newValue));
    };

    const isComfortModeOn = comfortMode !== 'off';
    const containerStyles = [styles.container, { borderColor: theme.colors.accent }];
    const customizedDescription = t`On, with your own changes kept. Turning it off restores what you had before.`;
    const presetDescription = t`Bigger board numbers, spacious cells, every highlight on, no timer, calm play, no animations and the high-contrast theme. Each one stays adjustable below.`;
    const toggleDescription = comfortMode === 'customized' ? customizedDescription : presetDescription;
    const toggle = (
        <AppToggle onValueChange={handleValueChange} testID={SettingsScreenSelectors.ComfortModeSwitch} value={isComfortModeOn} />
    );

    return (
        <View style={containerStyles} testID={SettingsScreenSelectors.ComfortModeSection}>
            <AppSettingsSection title={t`Comfort`}>
                <AppSettingsRow description={toggleDescription} title={t`Comfort mode`} trailing={toggle} />
            </AppSettingsSection>
        </View>
    );
};
