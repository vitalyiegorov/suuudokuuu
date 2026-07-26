import { describe, expect, it } from '@jest/globals';

import { getInitialUnistylesThemeName } from './get-initial-unistyles-theme-name.util';

describe('getInitialUnistylesThemeName', () => {
    it('selects the dark default for a dark system appearance', () => {
        expect(getInitialUnistylesThemeName('dark')).toBe('bwDark');
    });

    it('selects the light default for a light system appearance', () => {
        expect(getInitialUnistylesThemeName('light')).toBe('bwLight');
    });

    it('falls back to the light default when the system appearance is unavailable', () => {
        expect(getInitialUnistylesThemeName(null)).toBe('bwLight');
    });
});
