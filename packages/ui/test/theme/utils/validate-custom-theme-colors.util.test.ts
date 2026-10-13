import { describe, expect, it } from 'vitest';

import { validateCustomThemeColors } from '../../../src/theme';

import type { ThemeInterface } from '../../../src/theme';

const MinimumBodyTextContrast = 4.5;
const TranslucentGrayContrast = 2.1683043518;
const DarkGrayContrast = 1.0464572896;

const ReadableColors: ThemeInterface['colors'] = {
    background: '#fff',
    ink: '#000',
    inkText: '#fff',
    overlayLight: '#fff',
    overlayDark: '#000',
    danger: '#fff',
    dangerText: '#000',
    accent: '#000',
    text: { primary: '#000', hint: '#000' },
    board: {
        selected: '#fff',
        selectedText: '#000',
        sameValue: '#fff',
        sameValueText: '#000',
        error: '#fff',
        filled: '#fff',
        emptyText: '#000'
    },
    candidate: { text: '#000', textSelected: '#000', fill: '#fff', fillSelected: '#fff', borderSelected: '#000' },
    numpad: { track: '#fff', trackFilled: '#fff', trackFilledText: '#000', text: '#000' },
    surface: { raised: '#fff', raisedText: '#000', subtle: '#fff', subtleText: '#000', subtleHint: '#000', group: '#fff', border: '#000' }
};

describe('validateCustomThemeColors', () => {
    it('accepts readable theme pairs', () => {
        expect(validateCustomThemeColors(ReadableColors)).toEqual([]);
    });

    it('reports the exact pair and contrast while ignoring unparseable pairs', () => {
        const issues = validateCustomThemeColors({ ...ReadableColors, dangerText: '#fff', text: { primary: 'invalid', hint: 'invalid' } });
        expect(issues).toEqual([
            { foregroundKey: 'dangerText', backgroundKey: 'danger', contrastRatio: 1, minimumRatio: MinimumBodyTextContrast }
        ]);
        expect(validateCustomThemeColors({ ...ReadableColors, danger: 'invalid' })).toEqual([]);
    });

    it('composites transparent surfaces and foregrounds before measuring contrast', () => {
        const issues = validateCustomThemeColors({
            ...ReadableColors,
            danger: 'rgba(0, 0, 0, 0.5)',
            dangerText: 'rgba(255, 255, 255, 0.5)'
        });
        expect(issues).toHaveLength(1);
        expect(issues[0]?.contrastRatio).toBeCloseTo(TranslucentGrayContrast, 8);
        expect(validateCustomThemeColors({ ...ReadableColors, background: 'invalid' })).toEqual([]);
    });

    it('retains the large digit contrast threshold separately from body text', () => {
        expect(
            validateCustomThemeColors({
                ...ReadableColors,
                board: { ...ReadableColors.board, selectedText: '#888', sameValueText: '#888' }
            })
        ).toEqual([]);
        const issues = validateCustomThemeColors({ ...ReadableColors, text: { ...ReadableColors.text, hint: '#888' } });
        expect(issues.map(issue => [issue.foregroundKey, issue.backgroundKey, issue.minimumRatio])).toEqual([
            ['text.hint', 'background', MinimumBodyTextContrast],
            ['text.hint', 'surface.group', MinimumBodyTextContrast]
        ]);
    });

    it('linearizes dark channels and preserves contrast symmetry', () => {
        const lightOnDark = validateCustomThemeColors({ ...ReadableColors, danger: '#090909', dangerText: '#101010' });
        const darkOnLight = validateCustomThemeColors({ ...ReadableColors, danger: '#101010', dangerText: '#090909' });
        expect(lightOnDark[0]?.contrastRatio).toBeCloseTo(DarkGrayContrast, 8);
        expect(darkOnLight[0]?.contrastRatio).toBe(lightOnDark[0]?.contrastRatio);
    });
});
