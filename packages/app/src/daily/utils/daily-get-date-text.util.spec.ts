import { describe, expect, it } from '@jest/globals';

import { dailyGetDateText } from './daily-get-date-text.util';

describe('dailyGetDateText', () => {
    it('should format a UTC day number as a short localized date regardless of the local timezone', () => {
        expect.assertions(1);

        expect(dailyGetDateText(0, 'en')).toBe('Thu, Jan 1');
    });

    it('should localize the date text', () => {
        expect.assertions(1);

        expect(dailyGetDateText(0, 'de')).toBe('Do., 1. Jan.');
    });
});
