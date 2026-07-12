import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';
import { FinnedFishTechnique } from '../../finned-fish-technique/classes/finned-fish.technique';

describe('FinnedXWingTechnique', () => {
    it('finds an X-Wing with a same-box fin', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [0, 0, [5, 6]],
            [0, 1, [5, 7]],
            [0, 4, [5, 8]],
            [1, 0, [5, 6]],
            [1, 4, [5, 8]],
            [2, 0, [5, 9]]
        );

        expectTechniqueResults(
            new FinnedFishTechnique({ technique: SolutionTechniqueEnum.FinnedXWing, size: 2, sashimi: false }).find(context),
            {
                technique: SolutionTechniqueEnum.FinnedXWing,
                results: [
                    [0, 1, 5],
                    [2, 0, 5]
                ],
                eliminations: [
                    [0, 1, 5],
                    [2, 0, 5]
                ]
            }
        );
    });
});
