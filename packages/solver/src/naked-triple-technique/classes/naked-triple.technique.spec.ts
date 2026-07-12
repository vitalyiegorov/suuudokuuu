import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';
import { NakedSubsetTechnique } from '../../naked-subset-technique/classes/naked-subset.technique';

describe('NakedTripleTechnique', () => {
    it('finds a triple whose candidates can be removed from peers', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2]], [0, 1, [2, 3]], [0, 2, [1, 3]], [0, 3, [1, 4]]);

        expectTechniqueResults(new NakedSubsetTechnique({ technique: SolutionTechniqueEnum.NakedTriple, size: 3 }).find(context), {
            technique: SolutionTechniqueEnum.NakedTriple,
            results: [[0, 3, 4]],
            eliminations: [[0, 3, 1]]
        });
    });
});
