import { useLingui } from '@lingui/react/macro';
import React from 'react';

import { ToggleSelect } from '../../../@generic/components/toggle-select/toggle-select';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { Languages } from '../../constant/languages.constant';
import { settingsSetAction } from '../../store/settings.actions';
import { settingsLanguageSelector } from '../../store/settings.selectors';
import { SettingsGroup } from '../settings-group/settings-group';

import type { SettingsState } from '../../store/settings.state';

export const LanguageToggle = () => {
    const { t, i18n } = useLingui();

    const dispatch = useAppDispatch();
    const currentLanguage = useAppSelector(settingsLanguageSelector);

    const handleChange = (language: SettingsState['language']) => {
        dispatch(settingsSetAction({ language }));
        i18n.activate(language);
    };

    const getLanguageText = (language: SettingsState['language']) => language;
    const getLanguageIndex = (language: SettingsState['language']) => Languages.indexOf(language);

    return (
        <SettingsGroup description={t`Game localization`} hasAnotherRow title={t`Language`}>
            <ToggleSelect
                initialValue={currentLanguage}
                onChange={handleChange}
                options={Languages}
                toNumberFn={getLanguageIndex}
                toTextFn={getLanguageText}
            />
        </SettingsGroup>
    );
};
