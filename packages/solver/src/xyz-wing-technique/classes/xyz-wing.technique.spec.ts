import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueElimination } from '../../@generic/test-utils/expect-technique-elimination.spec.util';

import { XYZWingTechnique } from './xyz-wing.technique';

describe('XYZWingTechnique', () => {
    it('finds a three-candidate pivot with two restricted pincers', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2, 3]], [1, 1, [3, 4]], [0, 1, [1, 3]], [1, 0, [2, 3]]);

        expectTechniqueElimination(new XYZWingTechnique().find(context), {
            technique: SolutionTechniqueEnum.XYZWing,
            rowIndex: 1,
            columnIndex: 1,
            value: 3
        });
    });
});
