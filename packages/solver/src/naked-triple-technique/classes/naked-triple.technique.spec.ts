import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueElimination } from '../../@generic/test-utils/expect-technique-elimination.spec.util';
import { NakedSubsetTechnique } from '../../naked-subset-technique/classes/naked-subset.technique';

describe('NakedTripleTechnique', () => {
    it('finds a triple whose candidates can be removed from peers', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2]], [0, 1, [2, 3]], [0, 2, [1, 3]], [0, 3, [1, 4]]);

        expectTechniqueElimination(new NakedSubsetTechnique({ technique: SolutionTechniqueEnum.NakedTriple, size: 3 }).find(context), {
            technique: SolutionTechniqueEnum.NakedTriple,
            rowIndex: 0,
            columnIndex: 3,
            value: 1
        });
    });
});
