import { describe, expect, it } from '@jest/globals';

import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';
import { BWDarkTheme, BWLightTheme } from '../themes/bw.theme';
import { NewspaperLightTheme } from '../themes/newspaper';

import { createCustomTheme } from './create-custom-theme.util';
import { resolveTheme } from './resolve-theme.util';
import { validateCustomThemeColors } from './validate-custom-theme-colors.util';

import type { CustomThemeInterface } from '../interface/custom-theme.interface';

const createdAt = 1;

describe('resolveTheme', () => {
    it('resolves preset ids through getTheme', () => {
        expect(resolveTheme(ThemeEnum.Newspaper, ColorSchemaEnum.Light, [])).toEqual(NewspaperLightTheme);
    });

    it('resolves a custom id to its stored variant colors', () => {
        const customTheme = createCustomTheme('Mine', ThemeEnum.Colorful, [], createdAt);

        expect(resolveTheme(customTheme.id, ColorSchemaEnum.Dark, [customTheme])).toEqual({
            hasErrorOutline: false,
            colors: customTheme.colors[ColorSchemaEnum.Dark]
        });
    });

    it('keeps the error outline cue of the preset a custom theme was derived from', () => {
        const customTheme = createCustomTheme('Mine', ThemeEnum.ColorblindSafe, [], createdAt);

        expect(resolveTheme(customTheme.id, ColorSchemaEnum.Light, [customTheme]).hasErrorOutline).toBe(true);
    });

    it('keeps loading a stored custom theme that the stricter contrast gate would flag', () => {
        const customTheme = createCustomTheme('Legacy', ThemeEnum.Colorful, [], createdAt);
        const unreadableColors = {
            ...customTheme.colors[ColorSchemaEnum.Light],
            text: { ...customTheme.colors[ColorSchemaEnum.Light].text, primary: '#F7ECD0' }
        };
        const legacyTheme: CustomThemeInterface = {
            ...customTheme,
            colors: { ...customTheme.colors, [ColorSchemaEnum.Light]: unreadableColors }
        };
        const resolved = resolveTheme(legacyTheme.id, ColorSchemaEnum.Light, [legacyTheme]);

        expect(validateCustomThemeColors(unreadableColors).length).toBeGreaterThan(0);
        expect(resolved.colors).toEqual(unreadableColors);
    });

    it('falls back to the BW preset when the custom theme is missing', () => {
        expect(resolveTheme('custom-missing', ColorSchemaEnum.Light, [])).toEqual(BWLightTheme);
        expect(resolveTheme('custom-missing', ColorSchemaEnum.Dark, [])).toEqual(BWDarkTheme);
    });
});
