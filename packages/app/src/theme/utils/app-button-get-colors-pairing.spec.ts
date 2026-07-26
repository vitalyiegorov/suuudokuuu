import { describe, expect, it } from '@jest/globals';
import { appButtonGetColors } from '@suuudokuuu/ui/app-button-get-colors';

import { BWDarkTheme, BWLightTheme } from '../themes/bw.theme';
import { ColorfulDarkTheme, ColorfulLightTheme } from '../themes/colorful.theme';
import { NewspaperDarkTheme, NewspaperLightTheme } from '../themes/newspaper';

import type { ThemeInterface } from '@suuudokuuu/ui/theme';

const allThemes: readonly ThemeInterface[] = [
    BWLightTheme,
    BWDarkTheme,
    ColorfulLightTheme,
    ColorfulDarkTheme,
    NewspaperLightTheme,
    NewspaperDarkTheme
];

describe('appButtonGetColors', () => {
    it('pairs the primary fill with the inverted label that icon buttons tint their glyphs with, in every theme variant', () => {
        allThemes.forEach(theme => {
            const colors = appButtonGetColors(theme, 'primary');

            expect(colors.textColor).toBe(theme.colors.label.inverted);
            expect(colors.backgroundColor).not.toBe(colors.textColor);
        });
    });

    it('lifts the primary fill off the page background so a bare icon button still reads as a button, in every theme variant', () => {
        allThemes.forEach(theme => {
            const colors = appButtonGetColors(theme, 'primary');

            expect(colors.backgroundColor).not.toBe(theme.colors.background);
        });
    });

    it('keeps the glass fill transparent so the liquid glass material shows through, in every theme variant', () => {
        allThemes.forEach(theme => {
            const colors = appButtonGetColors(theme, 'glass');

            expect(colors.backgroundColor).toBe('transparent');
            expect(colors.textColor).toBe(theme.colors.label.inverted);
        });
    });

    it('pairs the inverted fill with its own raised label instead of the inverted label, in every theme variant', () => {
        allThemes.forEach(theme => {
            const colors = appButtonGetColors(theme, 'inverted');

            expect(colors.textColor).toBe(theme.colors.surface.raisedText);
            expect(colors.backgroundColor).not.toBe(colors.textColor);
        });
    });
});
