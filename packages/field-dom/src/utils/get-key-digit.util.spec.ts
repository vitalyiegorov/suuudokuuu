import { describe, expect, it } from '@jest/globals';

import { getKeyDigit } from './get-key-digit.util';

describe('getKeyDigit', () => {
    it.each([
        ['1', 1],
        ['5', 5],
        ['9', 9]
    ])('maps %s to %s', (key, digit) => {
        expect(getKeyDigit(key)).toBe(digit);
    });

    it.each(['0', '10', 'a', 'ArrowUp', ''])('returns null for %s', key => {
        expect(getKeyDigit(key)).toBeNull();
    });
});
