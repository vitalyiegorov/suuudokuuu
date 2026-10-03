import { SettingsRepository } from '@suuudokuuu/progress';
import { AppSettingsRow, AppToggle } from '@suuudokuuu/ui';
import * as Effect from 'effect/Effect';
import { ImpactFeedbackStyle } from 'expo-haptics';

import { useVibration } from '../../../@generic/hooks/use-vibration.hook';
import { appRuntime } from '../../../@generic/runtime/app.runtime';
import { useSettings } from '../../query/use-settings.query';

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
        void appRuntime.runPromise(
            Effect.flatMap(SettingsRepository, settingsRepository => settingsRepository.update({ [setting]: newValue }))
        );
    };
    const trailing = <AppToggle onValueChange={handleValueChange} testID={testID} value={settingValue} />;

    return <AppSettingsRow description={description} title={title} trailing={trailing} />;
};
