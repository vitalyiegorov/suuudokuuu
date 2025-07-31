import { use, useState } from 'react';
import { Switch, View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../@generic/context/theme.context';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsSetAction } from '../../store/settings.actions';
import { settingsKeySelector } from '../../store/settings.selectors';

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
    const descriptionStyles = [styles.description, { color: theme.text.hint }];

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <BlackText style={styles.title}>{title}</BlackText>
                <Switch
                    onValueChange={toggleSwitch}
                    style={styles.switch}
                    thumbColor={thumbColor}
                    trackColor={trackColor}
                    value={isEnabled}
                />
            </View>
            {isNotEmptyString(description) && <BlackText style={descriptionStyles}>{description}</BlackText>}
        </View>
    );
};
