import { ThemeEnum } from '@suuudokuuu/progress';

import { isDefined } from '@rnw-community/shared';

import { isCustomThemeId } from '../type-guard/is-custom-theme-id.type-guard';

import { getTheme } from './get-theme.util';

import type { ThemeIdType } from '../types/theme-id.type';
import type { ColorSchemaEnum, CustomThemeType } from '@suuudokuuu/progress';
import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const resolveTheme = (
    themeId: ThemeIdType,
    colorSchema: ColorSchemaEnum,
    customThemes: readonly CustomThemeType[]
): ThemeInterface => {
    if (isCustomThemeId(themeId)) {
        const customTheme = customThemes.find(theme => theme.id === themeId);

        if (isDefined(customTheme)) {
            return {
                hasErrorOutline: getTheme(customTheme.sourceTheme, colorSchema).hasErrorOutline,
                colors: customTheme.colors[colorSchema]
            };
        }

        return getTheme(ThemeEnum.BlackAndWhite, colorSchema);
    }

    return getTheme(themeId, colorSchema);
};
