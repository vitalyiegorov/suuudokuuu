import { useLingui } from '@lingui/react/macro';
import React, { use } from 'react';

import { ToggleSelect } from '../../../@generic/components/toggle-select/toggle-select';
import { ThemeContext } from '../../../@generic/context/theme.context';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { Themes } from '../../constant/themes.constant';
import { settingsThemeSelector } from '../../store/settings.selectors';
import { SettingsGroup } from '../settings-group/settings-group';

import type { SettingsState } from '../../store/settings.state';

export const ThemeToggle = () => {
    const { changeTheme } = use(ThemeContext);
    const { t } = useLingui();

    const currentTheme = useAppSelector(settingsThemeSelector);

    const getThemeText = (theme: SettingsState['theme']) => theme;
    const getThemeIndex = (theme: SettingsState['theme']) => Themes.indexOf(theme);

    return (
        <SettingsGroup description={t`Game appearance`} hasAnotherRow title={t`Theme`}>
            <ToggleSelect
                initialValue={currentTheme}
                onChange={changeTheme}
                options={Themes}
                toNumberFn={getThemeIndex}
                toTextFn={getThemeText}
            />
        </SettingsGroup>
    );
};
