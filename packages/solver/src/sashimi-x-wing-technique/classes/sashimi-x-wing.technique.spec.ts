import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueElimination } from '../../@generic/test-utils/expect-technique-elimination.spec.util';
import { FinnedFishTechnique } from '../../finned-fish-technique/classes/finned-fish.technique';

describe('SashimiXWingTechnique', () => {
    it('finds an X-Wing where one base line has one body candidate', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [5, 6]], [0, 1, [5, 7]], [1, 0, [5, 6]], [1, 4, [5, 8]], [2, 0, [5, 9]]);

        expectTechniqueElimination(
            new FinnedFishTechnique({ technique: SolutionTechniqueEnum.SashimiXWing, size: 2, sashimi: true }).find(context),
            { technique: SolutionTechniqueEnum.SashimiXWing, rowIndex: 2, columnIndex: 0, value: 5 }
        );
    });
});
