import { isDefined } from '@rnw-community/shared';

import { ThemeEnum } from '../enum/theme.enum';
import { isCustomThemeId } from '../type-guard/is-custom-theme-id.type-guard';

import { getTheme } from './get-theme.util';

import type { ColorSchemaEnum } from '../enum/color-schema.enum';
import type { CustomThemeInterface } from '../interface/custom-theme.interface';
import type { ThemeIdType } from '../types/theme-id.type';
import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const resolveTheme = (
    themeId: ThemeIdType,
    colorSchema: ColorSchemaEnum,
    customThemes: readonly CustomThemeInterface[]
): ThemeInterface => {
    if (isCustomThemeId(themeId)) {
        const customTheme = customThemes.find(theme => theme.id === themeId);

        if (isDefined(customTheme)) {
            return { colors: customTheme.colors[colorSchema] };
        }

        return getTheme(ThemeEnum.BlackAndWhite, colorSchema);
    }

    return getTheme(themeId, colorSchema);
};
