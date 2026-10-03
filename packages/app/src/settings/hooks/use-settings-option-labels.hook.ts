import { useLingui } from '@lingui/react/macro';
import { ThemeEnum } from '@suuudokuuu/progress';

import { useCustomThemes } from '../../theme/query/use-custom-themes.query';
import { isCustomThemeId } from '../../theme/type-guard/is-custom-theme-id.type-guard';
import { LanguageLabels } from '../constant/language-labels.constant';

import type { SettingsType } from '@suuudokuuu/progress';

export const useSettingsOptionLabels = () => {
    const { i18n, t } = useLingui();
    const customThemes = useCustomThemes();

    const getCellMarginLabel = (cellMargin: SettingsType['cellMargin']) =>
        ({
            0: t`Tight`,
            2: t`Comfortable`,
            5: t`Spacious`
        })[cellMargin];
    const getFontSizeLabel = (fontSize: SettingsType['fontSize']) => {
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
    const getMotionPreferenceLabel = (motionPreference: SettingsType['motionPreference']) => {
        if (motionPreference === 'full') {
            return t`Always on`;
        }

        if (motionPreference === 'reduced') {
            return t`Always off`;
        }

        return t`Follow system`;
    };
    const getLanguageLabel = (language: SettingsType['language']) => i18n._(LanguageLabels[language]);
    const getThemeLabel = (themeId: SettingsType['theme']) => {
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

    return { getCellMarginLabel, getFontSizeLabel, getLanguageLabel, getMotionPreferenceLabel, getThemeLabel };
};
