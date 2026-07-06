import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueElimination } from '../../@generic/test-utils/expect-technique-elimination.spec.util';
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

        expectTechniqueElimination(
            new FinnedFishTechnique({ technique: SolutionTechniqueEnum.FinnedXWing, size: 2, sashimi: false }).find(context),
            { technique: SolutionTechniqueEnum.FinnedXWing, rowIndex: 2, columnIndex: 0, value: 5 }
        );
    });
});
