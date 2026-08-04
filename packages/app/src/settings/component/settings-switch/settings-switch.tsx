import { AppSettingsRow, AppToggle } from '@suuudokuuu/ui';
import { ImpactFeedbackStyle } from 'expo-haptics';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { useVibration } from '../../../@generic/hooks/use-vibration.hook';
import { settingsSetAction } from '../../store/settings.actions';
import { settingsKeySelector } from '../../store/settings.selectors';

interface Props {
    readonly setting: Parameters<typeof settingsKeySelector>[0];
    readonly title: string;
    readonly description?: string;
    readonly testID?: string;
}

export const SettingsSwitch = ({ setting, title, description, testID }: Props) => {
    const settingValue = useAppSelector(settingsKeySelector(setting));
    const dispatch = useAppDispatch();
    const [, hapticImpact] = useVibration();
    const handleValueChange = (newValue: boolean) => {
        hapticImpact(ImpactFeedbackStyle.Light);
        dispatch(settingsSetAction({ [setting]: newValue }));
    };
    const trailing = <AppToggle onValueChange={handleValueChange} testID={testID} value={settingValue} />;

    return <AppSettingsRow description={description} title={title} trailing={trailing} />;
};
