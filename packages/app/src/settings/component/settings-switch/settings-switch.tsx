import { AppSettingsRow, AppToggle } from '@suuudokuuu/ui';
import { ImpactFeedbackStyle } from 'expo-haptics';

import { useVibration } from '../../../@generic/hooks/use-vibration.hook';
import { useSettings } from '../../query/use-settings.query';
import { updateSettings } from '../../utils/update-settings.util';

import type { SettingsType } from '@suuudokuuu/progress';

interface Props {
    readonly setting: { [Key in keyof SettingsType]: SettingsType[Key] extends boolean ? Key : never }[keyof SettingsType];
    readonly title: string;
    readonly description?: string;
    readonly testID?: string;
}

export const SettingsSwitch = ({ setting, title, description, testID }: Props) => {
    const settingValue = useSettings()[setting];
    const [, hapticImpact] = useVibration();
    const handleValueChange = (newValue: boolean) => {
        hapticImpact(ImpactFeedbackStyle.Light);
        void updateSettings({ [setting]: newValue });
    };
    const trailing = <AppToggle onValueChange={handleValueChange} testID={testID} value={settingValue} />;

    return <AppSettingsRow description={description} title={title} trailing={trailing} />;
};
