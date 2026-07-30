import { describe, expect, it } from '@jest/globals';

import { BWLightTheme } from '../themes/bw.theme';

import { validateCustomThemeColors } from './validate-custom-theme-colors.util';

describe('validateCustomThemeColors', () => {
    it('reports no issues for the BW light preset', () => {
        expect(validateCustomThemeColors(BWLightTheme.colors)).toEqual([]);
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
