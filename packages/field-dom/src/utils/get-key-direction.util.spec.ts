import { describe, expect, it } from '@jest/globals';

import { getKeyDirection } from './get-key-direction.util';

describe('getKeyDirection', () => {
    it.each([
        ['ArrowUp', 'up'],
        ['ArrowDown', 'down'],
        ['ArrowLeft', 'left'],
        ['ArrowRight', 'right']
    ])('maps %s to %s', (key, direction) => {
        expect(getKeyDirection(key)).toBe(direction);
    });

    it.each(['Enter', 'w', 'Tab', '1'])('returns null for %s', key => {
        expect(getKeyDirection(key)).toBeNull();
    });
});
