import { useLingui } from '@lingui/react/macro';

import { ThemeEnum } from '../../theme/enum/theme.enum';
import { LanguageLabels } from '../constant/language-labels.constant';

import type { SettingsState } from '../store/settings.state';

export const useSettingsOptionLabels = () => {
    const { i18n, t } = useLingui();

    const getCellMarginLabel = (cellMargin: SettingsState['cellMargin']) =>
        ({
            0: t`Tight`,
            2: t`Comfortable`,
            5: t`Spacious`
        })[cellMargin];
    const getFontSizeLabel = (fontSize: SettingsState['fontSize']) => {
        if (fontSize === 'xs') {
            return t`Tiny`;
        }

        if (fontSize === 's') {
            return t`Small`;
        }

        if (fontSize === 'm') {
            return t`Standard`;
        }

        return t`Large`;
    };
    const getLanguageLabel = (language: SettingsState['language']) => i18n._(LanguageLabels[language]);
    const getThemeLabel = (theme: SettingsState['theme']) =>
        ({
            [ThemeEnum.BlackAndWhite]: t`Classic`,
            [ThemeEnum.Colorful]: t`Gold`,
            [ThemeEnum.Newspaper]: t`Newspaper`
        })[theme];

    return { getCellMarginLabel, getFontSizeLabel, getLanguageLabel, getThemeLabel };
};
