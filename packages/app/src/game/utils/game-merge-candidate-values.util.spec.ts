import { describe, expect, it } from '@jest/globals';

import { gameMergeCandidateValues } from './game-merge-candidate-values.util';

describe('gameMergeCandidateValues', () => {
    it('should return the original candidates when there is nothing to merge', () => {
        expect.assertions(1);

        const candidates = [4, 1];

        expect(gameMergeCandidateValues(candidates, [])).toBe(candidates);
    });

    it('should merge, deduplicate and sort the merged candidates', () => {
        expect.assertions(1);

        expect(gameMergeCandidateValues([4, 1], [9, 1, 2])).toStrictEqual([1, 2, 4, 9]);
    });

    it('should sort the extra candidates when the cell has no notes', () => {
        expect.assertions(1);

        expect(gameMergeCandidateValues([], [7, 3])).toStrictEqual([3, 7]);
    });
});
