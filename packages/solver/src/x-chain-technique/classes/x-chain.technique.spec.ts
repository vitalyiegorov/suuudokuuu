import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

import { XChainTechnique } from './x-chain.technique';

describe('XChainTechnique', () => {
    it('finds an alternating strong-link chain that removes the endpoint value', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [5, 6]], [0, 3, [5, 7]], [1, 3, [5, 8]], [1, 1, [5, 9]], [2, 2, [5, 4]]);

        expectTechniqueResults(new XChainTechnique().find(context), {
            technique: SolutionTechniqueEnum.XChain,
            results: [[2, 2, 4]],
            eliminations: [[2, 2, 5]]
        });
    });

    it('ignores a chain when a strong link gains a third occurrence', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [0, 0, [5, 6]],
            [0, 3, [5, 7]],
            [0, 6, [5, 1]],
            [1, 3, [5, 8]],
            [1, 1, [5, 9]],
            [2, 2, [5, 4]]
        );
        const results = new XChainTechnique().find(context);

        expect(results.some(result => result.technique === SolutionTechniqueEnum.XChain)).toBe(false);
    });
});
