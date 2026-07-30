import { describe, expect, it } from '@jest/globals';

import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';
import { CustomThemeSchema } from '../schema/custom-theme.schema';
import { ColorfulDarkTheme, ColorfulLightTheme } from '../themes/colorful.theme';

import { createCustomTheme } from './create-custom-theme.util';

const firstCreatedAt = 123;
const secondCreatedAt = 1;
const thirdCreatedAt = 2;
const fourthCreatedAt = 3;

describe('createCustomTheme', () => {
    it('seeds a schema-valid theme from a preset', () => {
        const theme = createCustomTheme('Copy', ThemeEnum.Colorful, [], firstCreatedAt);

        expect(CustomThemeSchema.safeParse(theme).success).toBe(true);
        expect(theme.sourceTheme).toBe(ThemeEnum.Colorful);
        expect(theme.colors[ColorSchemaEnum.Light]).toEqual(ColorfulLightTheme.colors);
        expect(theme.colors[ColorSchemaEnum.Dark]).toEqual(ColorfulDarkTheme.colors);
        expect(theme.colors[ColorSchemaEnum.Light]).not.toBe(ColorfulLightTheme.colors);
        expect(theme.colors[ColorSchemaEnum.Light].cell).not.toBe(ColorfulLightTheme.colors.cell);
        expect(theme.createdAt).toBe(firstCreatedAt);
    });

    it('duplicates an existing custom theme with a fresh id and deep-copied colors', () => {
        const original = createCustomTheme('Original', ThemeEnum.Colorful, [], secondCreatedAt);
        const duplicate = createCustomTheme('Duplicate', original.id, [original], thirdCreatedAt);

        expect(duplicate.id).not.toBe(original.id);
        expect(duplicate.colors[ColorSchemaEnum.Light]).toEqual(original.colors[ColorSchemaEnum.Light]);
        expect(duplicate.colors[ColorSchemaEnum.Light]).not.toBe(original.colors[ColorSchemaEnum.Light]);
        expect(duplicate.colors[ColorSchemaEnum.Light].cell).not.toBe(original.colors[ColorSchemaEnum.Light].cell);
        expect(duplicate.sourceTheme).toBe(ThemeEnum.Colorful);
    });

    it('falls back to the BW preset when the source custom theme is missing', () => {
        const theme = createCustomTheme('Orphan', 'custom-missing', [], fourthCreatedAt);

        expect(theme.sourceTheme).toBe(ThemeEnum.BlackAndWhite);
    });
});
