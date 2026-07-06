import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueElimination } from '../../@generic/test-utils/expect-technique-elimination.spec.util';

import { WWingTechnique } from './w-wing.technique';

describe('WWingTechnique', () => {
    it('finds matching bivalue cells connected by a strong link', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([3, 0, [1, 2]], [4, 4, [1, 2]], [3, 8, [1, 5]], [4, 8, [1, 6]], [4, 0, [2, 9]]);

        expectTechniqueElimination(new WWingTechnique().find(context), {
            technique: SolutionTechniqueEnum.WWing,
            rowIndex: 4,
            columnIndex: 0,
            value: 2
        });
    });
});
