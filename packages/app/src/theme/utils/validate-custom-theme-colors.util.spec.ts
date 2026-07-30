import { describe, expect, it } from '@jest/globals';

import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';
import { BWLightTheme } from '../themes/bw.theme';

import { getTheme } from './get-theme.util';
import { validateCustomThemeColors } from './validate-custom-theme-colors.util';

describe('validateCustomThemeColors', () => {
    it('reports no issues for any preset in any variant', () => {
        Object.values(ThemeEnum).forEach(presetTheme => {
            Object.values(ColorSchemaEnum).forEach(colorSchema => {
                expect(validateCustomThemeColors(getTheme(presetTheme, colorSchema).colors)).toEqual([]);
            });
        });
    });

    it('reports a main label issue when text matches the background', () => {
        const colors = {
            ...BWLightTheme.colors,
            label: { ...BWLightTheme.colors.label, main: '#f2f2f2' }
        };
        const issues = validateCustomThemeColors(colors);
        const labelIssue = issues.find(issue => issue.foregroundKey === 'label.main');

        expect(labelIssue).toBeDefined();
        expect(labelIssue?.contrastRatio).toBeLessThan(labelIssue?.minimumRatio ?? 0);
    });

    it('composites translucent backgrounds over the page background', () => {
        const colors = {
            ...BWLightTheme.colors,
            cell: { ...BWLightTheme.colors.cell, highlightedText: 'rgba(255,255,255,1)' }
        };
        const issues = validateCustomThemeColors(colors);

        expect(issues.some(issue => issue.foregroundKey === 'cell.highlightedText')).toBe(true);
    });
});
