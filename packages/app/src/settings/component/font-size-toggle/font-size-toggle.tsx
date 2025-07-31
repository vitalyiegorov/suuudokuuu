import { useLingui } from '@lingui/react/macro';
import React from 'react';

import { ToggleSelect } from '../../../@generic/components/toggle-select/toggle-select';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { FontSizes } from '../../constant/font-sizes.constant';
import { settingsSetAction } from '../../store/settings.actions';
import { settingsFontSizeSelector } from '../../store/settings.selectors';
import { SettingsGroup } from '../settings-group/settings-group';

import type { SettingsState } from '../../store/settings.state';

export const FontSizeToggle = () => {
    const { t } = useLingui();

    const dispatch = useAppDispatch();
    const fontSize = useAppSelector(settingsFontSizeSelector);

    const handleChange = (size: SettingsState['fontSize']) => {
        dispatch(settingsSetAction({ fontSize: size }));
    };

    const getFontSizeIndex = (size: SettingsState['fontSize']) => FontSizes.indexOf(size);
    const getFontSizeText = (size: SettingsState['fontSize']) => size;

    return (
        <SettingsGroup description={t`Game screen font size`} hasAnotherRow title={t`Font size`}>
            <ToggleSelect
                initialValue={fontSize}
                onChange={handleChange}
                options={FontSizes}
                toNumberFn={getFontSizeIndex}
                toTextFn={getFontSizeText}
            />
        </SettingsGroup>
    );
};
