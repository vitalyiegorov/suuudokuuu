import { use, useState } from 'react';
import { Switch } from 'react-native';

import { ThemeContext } from '../../../@generic/context/theme.context';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsSetAction } from '../../store/settings.actions';
import { settingsKeySelector } from '../../store/settings.selectors';
import { SettingsGroup } from '../settings-group/settings-group';

import { SettingsSwitchStyles as styles } from './settings-switch.styles';

import type { SettingsState } from '../../store/settings.state';

interface Props {
    readonly setting: keyof Omit<SettingsState, 'fontSize'>;
    readonly title: string;
    readonly description?: string;
}

export const SettingsSwitch = ({ setting, title, description }: Props) => {
    const { theme } = use(ThemeContext);

    const settingValue = useAppSelector(settingsKeySelector(setting));
    const dispatch = useAppDispatch();

    const [isEnabled, setIsEnabled] = useState(settingValue);
    const toggleSwitch = () => {
        const newValue = !isEnabled;
        setIsEnabled(newValue);
        dispatch(settingsSetAction({ [setting]: newValue }));
    };

    const thumbColor = theme.colors.black;
    const trackColor = { false: theme.colors.red, true: theme.colors.blue };

    return (
        <SettingsGroup description={description} title={title}>
            <Switch onValueChange={toggleSwitch} style={styles.switch} thumbColor={thumbColor} trackColor={trackColor} value={isEnabled} />
        </SettingsGroup>
    );
};
