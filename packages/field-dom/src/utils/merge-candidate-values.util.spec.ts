import { describe, expect, it } from '@jest/globals';

import { mergeCandidateValues } from './merge-candidate-values.util';

describe('mergeCandidateValues', () => {
    it('returns an empty array without value groups', () => {
        expect(mergeCandidateValues()).toEqual([]);
    });

    it('deduplicates and sorts merged values', () => {
        expect(mergeCandidateValues([7, 3], [3, 1], [9])).toEqual([1, 3, 7, 9]);
    });

    it('keeps a single group sorted', () => {
        expect(mergeCandidateValues([5, 2, 8])).toEqual([2, 5, 8]);
    });
});
