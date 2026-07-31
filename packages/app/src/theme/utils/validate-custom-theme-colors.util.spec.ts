import { describe, expect, it } from '@jest/globals';

import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';
import { BWDarkTheme, BWLightTheme } from '../themes/bw.theme';

import { getTheme } from './get-theme.util';
import { validateCustomThemeColors } from './validate-custom-theme-colors.util';

const OpaqueWhiteContrastRatio = 1;

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
            text: { ...BWLightTheme.colors.text, primary: '#f2f2f2' }
        };
        const issues = validateCustomThemeColors(colors);
        const labelIssue = issues.find(issue => issue.foregroundKey === 'text.primary');

        expect(labelIssue).toBeDefined();
        expect(labelIssue?.contrastRatio).toBeLessThan(labelIssue?.minimumRatio ?? 0);
    });

    it('composites translucent backgrounds over the page background', () => {
        const colors = {
            ...BWLightTheme.colors,
            surface: { ...BWLightTheme.colors.surface, subtleText: 'rgba(255,255,255,1)' }
        };
        const issues = validateCustomThemeColors(colors);

        expect(issues.some(issue => issue.foregroundKey === 'surface.subtleText')).toBe(true);
    });

    it('skips a contrast pair when its foreground token cannot be parsed', () => {
        const colors = {
            ...BWLightTheme.colors,
            surface: { ...BWLightTheme.colors.surface, raisedText: 'not-a-color' }
        };

        expect(() => validateCustomThemeColors(colors)).not.toThrow();

        const issues = validateCustomThemeColors(colors);

        expect(issues.find(issue => issue.foregroundKey === 'surface.raisedText')).toBeUndefined();
    });

    it('skips a contrast pair when its background token cannot be parsed', () => {
        const colors = {
            ...BWLightTheme.colors,
            board: { ...BWLightTheme.colors.board, selected: 'not-a-color' }
        };
        const issues = validateCustomThemeColors(colors);

        expect(issues.find(issue => issue.foregroundKey === 'board.selectedText')).toBeUndefined();
    });

    it('falls back to opaque white for compositing when the page background cannot be parsed', () => {
        const colors = { ...BWDarkTheme.colors, background: 'not-a-color' };
        const issues = validateCustomThemeColors(colors);
        const highlightedIssue = issues.find(issue => issue.foregroundKey === 'surface.subtleText');

        expect(highlightedIssue).toBeDefined();
        expect(highlightedIssue?.contrastRatio).toBe(OpaqueWhiteContrastRatio);
    });
});
