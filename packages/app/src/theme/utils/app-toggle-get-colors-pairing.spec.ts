import { describe, expect, it } from '@jest/globals';
import { appToggleGetColors } from '@suuudokuuu/ui/app-toggle-get-colors';

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

describe('appToggleGetColors', () => {
    it('fills the checked track with the theme accent and its paired foreground, in every theme variant', () => {
        allThemes.forEach(theme => {
            const colors = appToggleGetColors(theme, true);

            expect(colors.trackColor).toBe(theme.colors.numpad.trackFilled);
            expect(colors.knobColor).toBe(theme.colors.numpad.trackFilledText);
        });
    });

    it('empties the unchecked track and outlines it with the row hint colour, in every theme variant', () => {
        allThemes.forEach(theme => {
            const colors = appToggleGetColors(theme, false);

            expect(colors.trackColor).toBe('transparent');
            expect(colors.trackBorderColor).toBe(theme.colors.surface.subtleHint);
        });
    });

    it('never resolves the same colour for the knob and its own track in either state, in every theme variant', () => {
        allThemes.forEach(theme => {
            [true, false].forEach(checked => {
                const colors = appToggleGetColors(theme, checked);

                expect(colors.knobColor).not.toBe(colors.trackColor);
            });
        });
    });

    it('never resolves the same track colour for the checked and unchecked states, in every theme variant', () => {
        allThemes.forEach(theme => {
            const checkedColors = appToggleGetColors(theme, true);
            const uncheckedColors = appToggleGetColors(theme, false);

            expect(checkedColors.trackColor).not.toBe(uncheckedColors.trackColor);
        });
    });
});
