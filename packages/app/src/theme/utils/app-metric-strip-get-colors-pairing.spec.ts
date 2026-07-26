import { describe, expect, it } from '@jest/globals';
import { appMetricStripGetColors } from '@suuudokuuu/ui/app-metric-strip-get-colors';

import { BWDarkTheme, BWLightTheme } from '../themes/bw.theme';
import { ColorfulDarkTheme, ColorfulLightTheme } from '../themes/colorful.theme';
import { NewspaperDarkTheme, NewspaperLightTheme } from '../themes/newspaper';

import type { AppMetricStripVariant } from '@suuudokuuu/ui/app-metric-strip-get-colors';
import type { ThemeInterface } from '@suuudokuuu/ui/theme';

const allThemes: readonly ThemeInterface[] = [
    BWLightTheme,
    BWDarkTheme,
    ColorfulLightTheme,
    ColorfulDarkTheme,
    NewspaperLightTheme,
    NewspaperDarkTheme
];
const allVariants: readonly AppMetricStripVariant[] = ['primary', 'secondary', 'ghost'];

const expectedTextColorFor = (theme: ThemeInterface, variant: AppMetricStripVariant) => {
    if (variant === 'primary') {
        return theme.colors.label.inverted;
    }

    if (variant === 'ghost') {
        return theme.colors.label.main;
    }

    return theme.colors.surface.subtleText;
};

describe('appMetricStripGetColors', () => {
    allVariants.forEach(variant => {
        it(`pairs the ${variant} surface with its own on-surface text colour in every theme variant`, () => {
            allThemes.forEach(theme => {
                const colors = appMetricStripGetColors(theme, variant);

                expect(colors.textColor).toBe(expectedTextColorFor(theme, variant));
            });
        });

        it(`never paints ${variant} label or value text in the same colour as its resolved surface, in every theme variant`, () => {
            allThemes.forEach(theme => {
                const colors = appMetricStripGetColors(theme, variant);

                expect(colors.textColor).not.toBe(colors.backgroundColor);
            });
        });
    });
});
