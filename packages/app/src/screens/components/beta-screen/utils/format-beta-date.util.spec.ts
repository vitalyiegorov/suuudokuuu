import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import { isString } from '@rnw-community/shared';

import { formatBetaDate } from './format-beta-date.util';

const TimestampNearMidnight = '2026-07-14T23:30:00Z';
const OriginalTimezone: unknown = Reflect.get(process.env, 'TZ');

describe('formatBetaDate', () => {
    beforeAll(() => {
        Reflect.set(process.env, 'TZ', 'Europe/Vienna');
    });

    afterAll(() => {
        if (isString(OriginalTimezone)) {
            Reflect.set(process.env, 'TZ', OriginalTimezone);

            return;
        }

        Reflect.deleteProperty(process.env, 'TZ');
    });

    it('formats a timestamp in the device timezone in English', () => {
        expect(formatBetaDate(TimestampNearMidnight, 'en')).toBe('Jul 15, 2026, 1:30 AM');
    });

    it('formats a timestamp in the device timezone in German', () => {
        expect(formatBetaDate(TimestampNearMidnight, 'de')).toBe('15.07.2026, 01:30');
    });
});
