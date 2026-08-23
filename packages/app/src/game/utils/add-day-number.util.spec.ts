import { describe, expect, it } from '@jest/globals';

import { addDayNumber } from './add-day-number.util';

describe('addDayNumber', () => {
    it('should add a new day number to an empty list', () => {
        expect.assertions(1);

        expect(addDayNumber([], 10)).toStrictEqual([10]);
    });

    it('should keep the list sorted ascending after inserting a new day number', () => {
        expect.assertions(1);

        expect(addDayNumber([5, 9], 7)).toStrictEqual([5, 7, 9]);
    });

    it('should not duplicate an already recorded day number', () => {
        expect.assertions(1);

        expect(addDayNumber([5, 7, 9], 7)).toStrictEqual([5, 7, 9]);
    });

    it('should not mutate the input array', () => {
        expect.assertions(2);

        const original = [1, 2];
        const result = addDayNumber(original, 3);

        expect(original).toStrictEqual([1, 2]);
        expect(result).toStrictEqual([1, 2, 3]);
    });
});
