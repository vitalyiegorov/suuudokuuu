import { isDefined } from '@rnw-community/shared';

import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';
import { CustomThemeSchemaVersion } from '../schema/custom-theme.schema';
import { isCustomThemeId } from '../type-guard/is-custom-theme-id.type-guard';

import { cloneThemeColors } from './clone-theme-colors.util';
import { generateCustomThemeId } from './generate-custom-theme-id.util';
import { getTheme } from './get-theme.util';

import type { CustomThemeInterface } from '../interface/custom-theme.interface';
import type { ThemeIdType } from '../types/theme-id.type';

const createFromPreset = (name: string, presetTheme: ThemeEnum, createdAt: number): CustomThemeInterface => ({
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
    customThemes: readonly CustomThemeInterface[],
    createdAt: number
): CustomThemeInterface => {
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
