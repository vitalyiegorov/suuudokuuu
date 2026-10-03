import { ColorSchemaEnum, ThemeEnum } from '@suuudokuuu/progress';

import { isDefined } from '@rnw-community/shared';

import { CustomThemeSchemaVersion } from '../constant/custom-theme.constant';
import { isCustomThemeId } from '../type-guard/is-custom-theme-id.type-guard';

import { cloneThemeColors } from './clone-theme-colors.util';
import { generateCustomThemeId } from './generate-custom-theme-id.util';
import { getTheme } from './get-theme.util';

import type { ThemeIdType } from '../types/theme-id.type';
import type { CustomThemeType } from '@suuudokuuu/progress';

const createFromPreset = (name: string, presetTheme: ThemeEnum, createdAt: number): CustomThemeType => ({
    id: generateCustomThemeId(),
    name,
    schemaVersion: CustomThemeSchemaVersion,
    sourceTheme: presetTheme,
    colors: {
        [ColorSchemaEnum.Light]: cloneThemeColors(getTheme(presetTheme, ColorSchemaEnum.Light).colors),
        [ColorSchemaEnum.Dark]: cloneThemeColors(getTheme(presetTheme, ColorSchemaEnum.Dark).colors)
    },
    createdAt,
    updatedAt: createdAt
});

export const createCustomTheme = (
    name: string,
    sourceThemeId: ThemeIdType,
    customThemes: readonly CustomThemeType[],
    createdAt: number
): CustomThemeType => {
    if (isCustomThemeId(sourceThemeId)) {
        const sourceCustomTheme = customThemes.find(theme => theme.id === sourceThemeId);

        if (isDefined(sourceCustomTheme)) {
            return {
                ...sourceCustomTheme,
                id: generateCustomThemeId(),
                name,
                colors: {
                    [ColorSchemaEnum.Light]: cloneThemeColors(sourceCustomTheme.colors[ColorSchemaEnum.Light]),
                    [ColorSchemaEnum.Dark]: cloneThemeColors(sourceCustomTheme.colors[ColorSchemaEnum.Dark])
                },
                createdAt,
                updatedAt: createdAt
            };
        }

        return createFromPreset(name, ThemeEnum.BlackAndWhite, createdAt);
    }

    return createFromPreset(name, sourceThemeId, createdAt);
};
