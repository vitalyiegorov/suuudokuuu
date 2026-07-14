import { describe, expect, it } from '@jest/globals';

import { formatBetaDate } from './format-beta-date.util';

describe('formatBetaDate', () => {
    it('formats a UTC date in English', () => {
        expect(formatBetaDate('2026-07-14T12:34:56Z', 'en')).toBe('Jul 14, 2026, 12:34 PM');
    });

    it('formats a UTC date in German', () => {
        expect(formatBetaDate('2026-07-14T12:34:56Z', 'de')).toBe('14.07.2026, 12:34');
    });
});
