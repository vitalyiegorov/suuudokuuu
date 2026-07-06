import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueElimination } from '../../@generic/test-utils/expect-technique-elimination.spec.util';

import { XYChainTechnique } from './xy-chain.technique';

describe('XYChainTechnique', () => {
    it('finds a bivalue chain that removes the endpoint value from common peers', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2]], [0, 1, [2, 3]], [1, 1, [1, 3]], [2, 2, [1, 4]]);

        expectTechniqueElimination(new XYChainTechnique().find(context), {
            technique: SolutionTechniqueEnum.XYChain,
            rowIndex: 2,
            columnIndex: 2,
            value: 1
        });
    });
});
