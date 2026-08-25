import { describe, expect, it } from '@jest/globals';

import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';
import { BWDarkTheme, BWLightTheme } from '../themes/bw.theme';
import { ColorblindSafeDarkTheme, ColorblindSafeLightTheme } from '../themes/colorblind-safe.theme';
import { ColorfulDarkTheme, ColorfulLightTheme } from '../themes/colorful.theme';
import { HighContrastDarkTheme, HighContrastLightTheme } from '../themes/high-contrast.theme';
import { NewspaperDarkTheme, NewspaperLightTheme } from '../themes/newspaper';

import { getTheme } from './get-theme.util';

describe('getTheme', () => {
    it('should resolve both schemas of every theme', () => {
        expect.assertions(10);

        expect(getTheme(ThemeEnum.BlackAndWhite, ColorSchemaEnum.Light)).toBe(BWLightTheme);
        expect(getTheme(ThemeEnum.BlackAndWhite, ColorSchemaEnum.Dark)).toBe(BWDarkTheme);
        expect(getTheme(ThemeEnum.Colorful, ColorSchemaEnum.Light)).toBe(ColorfulLightTheme);
        expect(getTheme(ThemeEnum.Colorful, ColorSchemaEnum.Dark)).toBe(ColorfulDarkTheme);
        expect(getTheme(ThemeEnum.Newspaper, ColorSchemaEnum.Light)).toBe(NewspaperLightTheme);
        expect(getTheme(ThemeEnum.Newspaper, ColorSchemaEnum.Dark)).toBe(NewspaperDarkTheme);
        expect(getTheme(ThemeEnum.HighContrast, ColorSchemaEnum.Light)).toBe(HighContrastLightTheme);
        expect(getTheme(ThemeEnum.HighContrast, ColorSchemaEnum.Dark)).toBe(HighContrastDarkTheme);
        expect(getTheme(ThemeEnum.ColorblindSafe, ColorSchemaEnum.Light)).toBe(ColorblindSafeLightTheme);
        expect(getTheme(ThemeEnum.ColorblindSafe, ColorSchemaEnum.Dark)).toBe(ColorblindSafeDarkTheme);
    });
});
