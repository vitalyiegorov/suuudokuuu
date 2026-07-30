import { describe, expect, it } from '@jest/globals';

import { createSeededRandom } from './create-seeded-random.util';

const SEED = 42;

describe('createSeededRandom', () => {
    it('is deterministic for a seed', () => {
        const first = createSeededRandom(SEED);
        const second = createSeededRandom(SEED);
        expect([first(), first(), first()]).toEqual([second(), second(), second()]);
    });

    it('produces values in [0, 1)', () => {
        const random = createSeededRandom(7);
        for (let iteration = 0; iteration < 1000; iteration += 1) {
            const value = random();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        }
    });

    it('differs across seeds', () => {
        expect(createSeededRandom(1)()).not.toBe(createSeededRandom(2)());
    });
});
