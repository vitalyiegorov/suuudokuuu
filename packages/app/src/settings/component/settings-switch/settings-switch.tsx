import { AppSettingsRow, AppToggle } from '@suuudokuuu/ui';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsSetAction } from '../../store/settings.actions';
import { settingsKeySelector } from '../../store/settings.selectors';

interface Props {
    readonly setting: Parameters<typeof settingsKeySelector>[0];
    readonly title: string;
    readonly description?: string;
}

export const SettingsSwitch = ({ setting, title, description }: Props) => {
    const settingValue = useAppSelector(settingsKeySelector(setting));
    const dispatch = useAppDispatch();
    const handleValueChange = (newValue: boolean) => {
        dispatch(settingsSetAction({ [setting]: newValue }));
    };
    const trailing = <AppToggle onValueChange={handleValueChange} value={settingValue} />;

    return <AppSettingsRow description={description} title={title} trailing={trailing} />;
};
