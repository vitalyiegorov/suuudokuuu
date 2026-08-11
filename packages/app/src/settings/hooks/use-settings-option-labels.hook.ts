import { useLingui } from '@lingui/react/macro';

import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { ThemeEnum } from '../../theme/enum/theme.enum';
import { customThemesSelector } from '../../theme/store/custom-themes.selectors';
import { isCustomThemeId } from '../../theme/type-guard/is-custom-theme-id.type-guard';
import { LanguageLabels } from '../constant/language-labels.constant';

import type { SettingsState } from '../store/settings.state';

export const useSettingsOptionLabels = () => {
    const { i18n, t } = useLingui();
    const customThemes = useAppSelector(customThemesSelector);

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
    const getThemeLabel = (themeId: SettingsState['theme']) => {
        if (isCustomThemeId(themeId)) {
            return customThemes.find(theme => theme.id === themeId)?.name ?? t`Custom theme`;
        }

        return {
            [ThemeEnum.BlackAndWhite]: t`Classic`,
            [ThemeEnum.Colorful]: t`Gold`,
            [ThemeEnum.Newspaper]: t`Newspaper`,
            [ThemeEnum.HighContrast]: t`High contrast`,
            [ThemeEnum.ColorblindSafe]: t`Colorblind safe`
        }[themeId];
    };

    return { getCellMarginLabel, getFontSizeLabel, getLanguageLabel, getThemeLabel };
};
