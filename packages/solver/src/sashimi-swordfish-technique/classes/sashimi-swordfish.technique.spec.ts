import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueElimination } from '../../@generic/test-utils/expect-technique-elimination.spec.util';
import { FinnedFishTechnique } from '../../finned-fish-technique/classes/finned-fish.technique';

describe('SashimiSwordfishTechnique', () => {
    it('finds a Swordfish where one base line has one body candidate', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [0, 0, [5, 9]],
            [1, 0, [5, 9]],
            [1, 3, [5, 9]],
            [3, 0, [5, 9]],
            [3, 3, [5, 9]],
            [3, 6, [5, 9]],
            [3, 7, [5, 9]],
            [4, 6, [5, 8]]
        );

        expectTechniqueElimination(
            new FinnedFishTechnique({ technique: SolutionTechniqueEnum.SashimiSwordfish, size: 3, sashimi: true }).find(context),
            { technique: SolutionTechniqueEnum.SashimiSwordfish, rowIndex: 4, columnIndex: 6, value: 5 }
        );
    });
});
