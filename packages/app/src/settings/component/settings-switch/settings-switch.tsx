import { use, useState } from 'react';
import { Platform, Switch } from 'react-native';

import { ThemeContext } from '../../../@generic/context/theme.context';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsSetAction } from '../../store/settings.actions';
import { settingsKeySelector } from '../../store/settings.selectors';
import { SettingsGroup } from '../settings-group/settings-group';

import { SettingsSwitchStyles as styles } from './settings-switch.styles';

interface Props {
    readonly setting: Parameters<typeof settingsKeySelector>[0];
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
    const trackColor = { false: theme.colors.black05, true: theme.colors.black05 };

    return (
        <SettingsGroup description={description} title={title}>
            <Switch
                {...(Platform.OS === 'web' && {
                    // HINT: https://necolas.github.io/react-native-web/docs/switch/
                    activeTrackColor: theme.colors.black05,
                    activeThumbColor: theme.colors.black
                })}
                onValueChange={toggleSwitch}
                style={styles.switch}
                thumbColor={thumbColor}
                trackColor={trackColor}
                value={isEnabled}
            />
        </SettingsGroup>
    );
};
