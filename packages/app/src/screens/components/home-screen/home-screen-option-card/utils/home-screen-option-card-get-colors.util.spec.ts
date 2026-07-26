import { describe, expect, it } from '@jest/globals';

import { BWDarkTheme, BWLightTheme } from '../../../../../theme/themes/bw.theme';
import { ColorfulDarkTheme, ColorfulLightTheme } from '../../../../../theme/themes/colorful.theme';
import { NewspaperDarkTheme, NewspaperLightTheme } from '../../../../../theme/themes/newspaper';

import { homeScreenOptionCardGetColors } from './home-screen-option-card-get-colors.util';

import type { ThemeInterface } from '@suuudokuuu/ui/theme';

const allThemes: readonly ThemeInterface[] = [
    BWLightTheme,
    BWDarkTheme,
    ColorfulLightTheme,
    ColorfulDarkTheme,
    NewspaperLightTheme,
    NewspaperDarkTheme
];

describe('homeScreenOptionCardGetColors', () => {
    it('pairs the selected treatment with its own on-surface text colour in every theme', () => {
        allThemes.forEach(theme => {
            const colors = homeScreenOptionCardGetColors(theme, true);

            expect(colors.backgroundColor).toBe(theme.colors.black);
            expect(colors.borderColor).toBe(theme.colors.black);
            expect(colors.titleColor).toBe(theme.colors.label.inverted);
            expect(colors.descriptionColor).toBe(theme.colors.label.inverted);
        });
    });

    it('pairs the unselected treatment with the page background and its own on-surface text colour in every theme', () => {
        allThemes.forEach(theme => {
            const colors = homeScreenOptionCardGetColors(theme, false);

            expect(colors.backgroundColor).toBe('transparent');
            expect(colors.borderColor).toBe(theme.colors.candidate.border);
            expect(colors.titleColor).toBe(theme.colors.label.main);
            expect(colors.descriptionColor).toBe(theme.colors.label.hint);
        });
    });

    it('never paints title text in the same colour as its resolved background, in every theme variant', () => {
        allThemes.forEach(theme => {
            const selected = homeScreenOptionCardGetColors(theme, true);
            const unselected = homeScreenOptionCardGetColors(theme, false);

            expect(selected.titleColor).not.toBe(selected.backgroundColor);
            expect(unselected.titleColor).not.toBe(unselected.backgroundColor);
        });
    });

    it('keeps the selected and unselected card treatments visually distinct in every theme', () => {
        allThemes.forEach(theme => {
            const selected = homeScreenOptionCardGetColors(theme, true);
            const unselected = homeScreenOptionCardGetColors(theme, false);

            expect(selected.backgroundColor).not.toBe(unselected.backgroundColor);
            expect(selected.borderColor).not.toBe(unselected.borderColor);
        });
    });
});
