import { describe, expect, it } from 'vitest';

import { appButtonGetTextColor } from '../../../../src/components/app-button/utils/app-button-get-text-color.util';

const theme = {
    colors: {
        background: '',
        ink: '',
        inkText: 'ink-text',
        overlayLight: '',
        overlayDark: '',
        danger: '',
        dangerText: 'danger-text',
        accent: '',
        text: { primary: 'primary-text', hint: '' },
        board: { selected: '', selectedText: 'selected-text', sameValue: '', sameValueText: '', error: '', filled: '', emptyText: '' },
        candidate: { text: '', textSelected: '', fill: '', fillSelected: '', borderSelected: '' },
        numpad: { track: '', trackFilled: '', trackFilledText: '', text: '' },
        surface: { raised: '', raisedText: 'raised-text', subtle: '', subtleText: 'subtle-text', subtleHint: '', group: '', border: '' }
    }
};

describe('appButtonGetTextColor', () => {
    it('selects the same theme token for text, icon and loader tint in every supported variant', () => {
        expect(appButtonGetTextColor(theme, 'primary')).toBe('ink-text');
        expect(appButtonGetTextColor(theme, 'glass')).toBe('ink-text');
        expect(appButtonGetTextColor(theme, 'secondary')).toBe('subtle-text');
        expect(appButtonGetTextColor(theme, 'ghost')).toBe('primary-text');
        expect(appButtonGetTextColor(theme, 'inverted')).toBe('raised-text');
        expect(appButtonGetTextColor(theme, 'dangerFilled')).toBe('danger-text');
        expect(appButtonGetTextColor(theme, 'boardSelected')).toBe('selected-text');
    });
});
