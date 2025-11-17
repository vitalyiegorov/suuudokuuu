import { useLingui } from '@lingui/react/macro';
import React from 'react';

import { ToggleSelect } from '../../../@generic/components/toggle-select/toggle-select';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { CellMargin } from '../../constant/cell-margin.constant';
import { settingsSetAction } from '../../store/settings.actions';
import { settingsCellMarginSelector } from '../../store/settings.selectors';
import { SettingsGroup } from '../settings-group/settings-group';

import type { SettingsState } from '../../store/settings.state';

export const CellMarginToggle = () => {
    const { t } = useLingui();

    const dispatch = useAppDispatch();
    const cellMargin = useAppSelector(settingsCellMarginSelector);

    const handleChange = (cellMargin: SettingsState['cellMargin']) => {
        dispatch(settingsSetAction({ cellMargin }));
    };

    const getCellMarginIndex = (margin: SettingsState['cellMargin']) => CellMargin.indexOf(margin);
    const getCellMarginText = (margin: SettingsState['cellMargin']) =>
        ({
            0: t`none`,
            2: t`small`,
            5: t`big`
        })[margin];

    return (
        <SettingsGroup description={t`Game screen cell margin`} hasAnotherRow title={t`Cell margin`}>
            <ToggleSelect
                initialValue={cellMargin}
                onChange={handleChange}
                options={CellMargin}
                toNumberFn={getCellMarginIndex}
                toTextFn={getCellMarginText}
            />
        </SettingsGroup>
    );
};
