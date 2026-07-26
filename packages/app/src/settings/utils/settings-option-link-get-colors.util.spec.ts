import { describe, expect, it } from '@jest/globals';

import { BWDarkTheme, BWLightTheme } from '../../theme/themes/bw.theme';
import { ColorfulDarkTheme, ColorfulLightTheme } from '../../theme/themes/colorful.theme';
import { NewspaperDarkTheme, NewspaperLightTheme } from '../../theme/themes/newspaper';

import { settingsOptionLinkGetColors } from './settings-option-link-get-colors.util';

import type { ThemeInterface } from '@suuudokuuu/ui/theme';

const allThemes: readonly ThemeInterface[] = [
    BWLightTheme,
    BWDarkTheme,
    ColorfulLightTheme,
    ColorfulDarkTheme,
    NewspaperLightTheme,
    NewspaperDarkTheme
];

describe('settingsOptionLinkGetColors', () => {
    it('pairs the value text with the row surface on-surface text colour, in every theme variant', () => {
        allThemes.forEach(theme => {
            const colors = settingsOptionLinkGetColors(theme);

            expect(colors.valueColor).toBe(theme.colors.surface.subtleText);
        });
    });

    it('never resolves the value text to the same colour as the row surface it sits on, in every theme variant', () => {
        allThemes.forEach(theme => {
            const colors = settingsOptionLinkGetColors(theme);

            expect(colors.valueColor).not.toBe(theme.colors.surface.subtle);
        });
    });
});
