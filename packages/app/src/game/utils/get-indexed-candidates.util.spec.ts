import { describe, expect, it } from '@jest/globals';

import { getIndexedCandidates } from './get-indexed-candidates.util';
import { getKeyedCandidates } from './get-keyed-candidates.util';

describe('getIndexedCandidates', () => {
    it('should convert row column keys into flat cell indexes', () => {
        expect.assertions(1);

        expect(getIndexedCandidates({ '0-0': [1], '4-4': [2, 6], '8-8': [9] })).toStrictEqual({ 0: [1], 40: [2, 6], 80: [9] });
    });

    it('should return an empty record for empty candidates', () => {
        expect.assertions(1);

        expect(getIndexedCandidates({})).toStrictEqual({});
    });
});

describe('getKeyedCandidates', () => {
    it('should convert flat cell indexes back into row column keys', () => {
        expect.assertions(1);

        expect(getKeyedCandidates({ 0: [1], 40: [2, 6], 80: [9] })).toStrictEqual({ '0-0': [1], '4-4': [2, 6], '8-8': [9] });
    });

    it('should return an empty record for empty candidates', () => {
        expect.assertions(1);

        expect(getKeyedCandidates({})).toStrictEqual({});
    });

    it('should round-trip every keyed candidate entry', () => {
        expect.assertions(1);

        const candidates = { '2-7': [3], '5-1': [4, 8] };

        expect(getKeyedCandidates(getIndexedCandidates(candidates))).toStrictEqual(candidates);
    });
});
