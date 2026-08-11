import { useLingui } from '@lingui/react/macro';

import { ThemeEnum } from '../../theme/enum/theme.enum';
import { isCustomThemeId } from '../../theme/type-guard/is-custom-theme-id.type-guard';

import type { SettingsState } from '../store/settings.state';

export const useSettingsOptionDescriptions = () => {
    const { t } = useLingui();

    const getCellMarginDescription = (cellMargin: SettingsState['cellMargin']) =>
        ({
            0: t`No extra gaps between cells`,
            2: t`A little room between cells`,
            5: t`Wider gaps for easier tapping`
        })[cellMargin];
    const getFontSizeDescription = (fontSize: SettingsState['fontSize']) => {
        if (fontSize === 'xs') {
            return t`Smallest digits for compact boards`;
        }

        if (fontSize === 's') {
            return t`Smaller digits for more board space`;
        }

        if (fontSize === 'm') {
            return t`Balanced digits for most players`;
        }

        return t`Larger digits for easier reading`;
    };
    const getLanguageDescription = (language: SettingsState['language']) =>
        ({
            ar: t`Use Arabic for app text`,
            bn: t`Use Bengali for app text`,
            de: t`Use German for app text`,
            en: t`Use English for app text`,
            es: t`Use Spanish for app text`,
            fr: t`Use French for app text`,
            hi: t`Use Hindi for app text`,
            id: t`Use Indonesian for app text`,
            pt: t`Use Portuguese for app text`,
            sv: t`Use Swedish for app text`,
            uk: t`Use Ukrainian for app text`,
            ur: t`Use Urdu for app text`,
            zh: t`Use Chinese for app text`
        })[language];
    const getThemeDescription = (theme: SettingsState['theme']) => {
        if (isCustomThemeId(theme)) {
            return t`Your custom colors`;
        }

        return {
            [ThemeEnum.BlackAndWhite]: t`Clean black-and-white board`,
            [ThemeEnum.Colorful]: t`Warm gold accents for a brighter board`,
            [ThemeEnum.Newspaper]: t`Soft gray board with a paper-like feel`,
            [ThemeEnum.HighContrast]: t`Maximum separation between board states`,
            [ThemeEnum.ColorblindSafe]: t`Board states told apart by lightness and outlines, not hue`
        }[theme];
    };

    return {
        getCellMarginDescription,
        getFontSizeDescription,
        getLanguageDescription,
        getThemeDescription
    };
};
