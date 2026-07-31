import { describe, expect, it } from '@jest/globals';

import { BWDarkTheme, BWLightTheme } from '../../../../../theme/themes/bw.theme';
import { ColorfulDarkTheme, ColorfulLightTheme } from '../../../../../theme/themes/colorful.theme';
import { NewspaperDarkTheme, NewspaperLightTheme } from '../../../../../theme/themes/newspaper';

import { difficultyComplexityPreviewGetColors } from './difficulty-complexity-preview-get-colors.util';

import type { ThemeInterface } from '@suuudokuuu/ui/theme';

const allThemes: readonly ThemeInterface[] = [
    BWLightTheme,
    BWDarkTheme,
    ColorfulLightTheme,
    ColorfulDarkTheme,
    NewspaperLightTheme,
    NewspaperDarkTheme
];

describe('difficultyComplexityPreviewGetColors', () => {
    it('lets the page background show through behind a themed hairline border, in every theme variant', () => {
        allThemes.forEach(theme => {
            const colors = difficultyComplexityPreviewGetColors(theme);

            expect(colors.backgroundColor).toBe('transparent');
            expect(colors.borderColor).toBe(theme.colors.surface.border);
        });
    });

    it('never resolves the border to the same colour as the background, in every theme variant', () => {
        allThemes.forEach(theme => {
            const colors = difficultyComplexityPreviewGetColors(theme);

            expect(colors.borderColor).not.toBe(colors.backgroundColor);
        });
    });
});
