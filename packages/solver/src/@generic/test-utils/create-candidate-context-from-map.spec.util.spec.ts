import { describe, expect, it } from '@jest/globals';

import { createCandidateContextFromMap } from './create-candidate-context-from-map.spec.util';

describe('createCandidateContextFromMap', () => {
    it('creates a candidate context from row and column candidate entries', () => {
        expect.assertions(2);

        const context = createCandidateContextFromMap([0, 1, [2, 3]], [4, 5, [6]]);

        expect(context.getCandidates(context.getRowCells(0)[1])).toEqual([2, 3]);
        expect(context.getCandidates(context.getRowCells(4)[5])).toEqual([6]);
    });
});
