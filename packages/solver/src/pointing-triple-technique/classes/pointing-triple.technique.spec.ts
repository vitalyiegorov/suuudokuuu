import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueElimination } from '../../@generic/test-utils/expect-technique-elimination.spec.util';
import { PointingTechnique } from '../../pointing-technique/classes/pointing.technique';

describe('PointingTripleTechnique', () => {
    it('finds a box candidate triple confined to one line', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [5, 6]], [0, 1, [5, 7]], [0, 2, [5, 8]], [0, 3, [5, 9]]);

        expectTechniqueElimination(new PointingTechnique({ technique: SolutionTechniqueEnum.PointingTriple, size: 3 }).find(context), {
            technique: SolutionTechniqueEnum.PointingTriple,
            rowIndex: 0,
            columnIndex: 3,
            value: 5
        });
    });
});
