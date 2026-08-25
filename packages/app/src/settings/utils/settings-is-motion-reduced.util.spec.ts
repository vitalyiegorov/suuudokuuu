import { describe, expect, it } from '@jest/globals';

import { settingsIsMotionReduced } from './settings-is-motion-reduced.util';

describe('settingsIsMotionReduced', () => {
    it('should follow the operating system while the player keeps the system preference', () => {
        expect.assertions(2);

        expect(settingsIsMotionReduced('system', true)).toBe(true);
        expect(settingsIsMotionReduced('system', false)).toBe(false);
    });

    it('should let the player keep animations even when the operating system reduces motion', () => {
        expect.assertions(2);

        expect(settingsIsMotionReduced('full', true)).toBe(false);
        expect(settingsIsMotionReduced('full', false)).toBe(false);
    });

    it('should let the player drop animations even when the operating system allows them', () => {
        expect.assertions(2);

        expect(settingsIsMotionReduced('reduced', false)).toBe(true);
        expect(settingsIsMotionReduced('reduced', true)).toBe(true);
    });
});
