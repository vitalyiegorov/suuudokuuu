import { describe, expect, it } from '@jest/globals';
import { createSeededRandom } from '@suuudokuuu/solver-core';

import { shuffle } from './shuffle.util';

const source = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const seed = 20260823;
const otherSeed = 20260824;

describe('shuffle', () => {
    it('should not mutate the source array', () => {
        expect.assertions(2);

        const result = shuffle(source, createSeededRandom(seed));

        expect(source).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(result).not.toBe(source);
    });

    it('should keep every element exactly once', () => {
        expect.assertions(1);

        expect([...shuffle(source, createSeededRandom(seed))].sort((first, second) => first - second)).toStrictEqual(source);
    });

    it('should produce the same order for the same seed', () => {
        expect.assertions(1);

        expect(shuffle(source, createSeededRandom(seed))).toStrictEqual(shuffle(source, createSeededRandom(seed)));
    });

    it('should produce a different order for a different seed', () => {
        expect.assertions(1);

        expect(shuffle(source, createSeededRandom(seed))).not.toStrictEqual(shuffle(source, createSeededRandom(otherSeed)));
    });

    it('should return a single element array untouched', () => {
        expect.assertions(1);

        expect(shuffle([7], createSeededRandom(seed))).toStrictEqual([7]);
    });
});
