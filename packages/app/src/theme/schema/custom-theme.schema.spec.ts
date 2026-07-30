import { describe, expect, it } from '@jest/globals';

import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';
import { BWDarkTheme, BWLightTheme } from '../themes/bw.theme';

import { CustomThemeSchema, CustomThemeSchemaVersion } from './custom-theme.schema';

const validCustomTheme = {
    id: 'custom-abc123',
    name: 'My theme',
    schemaVersion: CustomThemeSchemaVersion,
    sourceTheme: ThemeEnum.BlackAndWhite,
    colors: {
        [ColorSchemaEnum.Light]: BWLightTheme.colors,
        [ColorSchemaEnum.Dark]: BWDarkTheme.colors
    },
    createdAt: 1753833600000,
    updatedAt: 1753833600000
};

describe('CustomThemeSchema', () => {
    it('accepts a valid custom theme', () => {
        expect(CustomThemeSchema.safeParse(validCustomTheme).success).toBe(true);
    });

    it('rejects a non-custom id', () => {
        expect(CustomThemeSchema.safeParse({ ...validCustomTheme, id: 'black-and-white' }).success).toBe(false);
    });

    it('rejects an empty name', () => {
        expect(CustomThemeSchema.safeParse({ ...validCustomTheme, name: '  ' }).success).toBe(false);
    });

    it('rejects a name longer than 24 characters', () => {
        const nameOverMaxLength = 25;
        expect(CustomThemeSchema.safeParse({ ...validCustomTheme, name: 'x'.repeat(nameOverMaxLength) }).success).toBe(false);
    });

    it('rejects unknown schema versions', () => {
        const unknownSchemaVersion = 99;
        expect(CustomThemeSchema.safeParse({ ...validCustomTheme, schemaVersion: unknownSchemaVersion }).success).toBe(false);
    });

    it('rejects an unparseable color token', () => {
        const brokenColors = {
            ...validCustomTheme.colors,
            [ColorSchemaEnum.Light]: {
                ...BWLightTheme.colors,
                background: 'not-a-color'
            }
        };
        expect(CustomThemeSchema.safeParse({ ...validCustomTheme, colors: brokenColors }).success).toBe(false);
    });

    it('rejects a missing token group', () => {
        const { cell: _unusedCell, ...withoutCell } = BWLightTheme.colors;
        const brokenColors = { ...validCustomTheme.colors, [ColorSchemaEnum.Light]: withoutCell };
        expect(CustomThemeSchema.safeParse({ ...validCustomTheme, colors: brokenColors }).success).toBe(false);
    });

    it('rejects extra unknown keys', () => {
        expect(CustomThemeSchema.safeParse({ ...validCustomTheme, extra: true }).success).toBe(false);
    });
});
