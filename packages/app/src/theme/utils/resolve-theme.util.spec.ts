import { describe, expect, it } from '@jest/globals';

import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';
import { BWDarkTheme, BWLightTheme } from '../themes/bw.theme';
import { NewspaperLightTheme } from '../themes/newspaper';

import { createCustomTheme } from './create-custom-theme.util';
import { resolveTheme } from './resolve-theme.util';

const createdAt = 1;

describe('resolveTheme', () => {
    it('resolves preset ids through getTheme', () => {
        expect(resolveTheme(ThemeEnum.Newspaper, ColorSchemaEnum.Light, [])).toEqual(NewspaperLightTheme);
    });

    it('resolves a custom id to its stored variant colors', () => {
        const customTheme = createCustomTheme('Mine', ThemeEnum.Colorful, [], createdAt);

        expect(resolveTheme(customTheme.id, ColorSchemaEnum.Dark, [customTheme])).toEqual({
            colors: customTheme.colors[ColorSchemaEnum.Dark]
        });
    });

    it('falls back to the BW preset when the custom theme is missing', () => {
        expect(resolveTheme('custom-missing', ColorSchemaEnum.Light, [])).toEqual(BWLightTheme);
        expect(resolveTheme('custom-missing', ColorSchemaEnum.Dark, [])).toEqual(BWDarkTheme);
    });
});
