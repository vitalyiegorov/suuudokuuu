import { describe, expect, it } from '@jest/globals';

import { BWDarkTheme, BWLightTheme } from '../../theme/themes/bw.theme';
import { ColorfulDarkTheme, ColorfulLightTheme } from '../../theme/themes/colorful.theme';
import { NewspaperDarkTheme, NewspaperLightTheme } from '../../theme/themes/newspaper';

import { settingsOptionSheetGetColors } from './settings-option-sheet-get-colors.util';

import type { ThemeInterface } from '@suuudokuuu/ui/theme';

const allThemes: readonly ThemeInterface[] = [
    BWLightTheme,
    BWDarkTheme,
    ColorfulLightTheme,
    ColorfulDarkTheme,
    NewspaperLightTheme,
    NewspaperDarkTheme
];

describe('settingsOptionSheetGetColors', () => {
    it('pairs the sheet panel with the app page background and its own on-surface text colours in every theme', () => {
        allThemes.forEach(theme => {
            const colors = settingsOptionSheetGetColors(theme);

            expect(colors.panelBackground).toBe(theme.colors.background);
            expect(colors.panelText).toBe(theme.colors.text.primary);
            expect(colors.descriptionColor).toBe(theme.colors.text.hint);
        });
    });

    it('never paints the panel text or description in the same colour as the resolved panel background, in every theme variant', () => {
        allThemes.forEach(theme => {
            const colors = settingsOptionSheetGetColors(theme);

            expect(colors.panelText).not.toBe(colors.panelBackground);
            expect(colors.descriptionColor).not.toBe(colors.panelBackground);
        });
    });
});
