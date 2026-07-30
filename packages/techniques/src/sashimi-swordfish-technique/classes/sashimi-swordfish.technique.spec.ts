import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';
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

        expectTechniqueResults(
            context,
            new FinnedFishTechnique({ technique: SolutionTechniqueEnum.SashimiSwordfish, size: 3, sashimi: true }).find(context),
            [
                {
                    technique: SolutionTechniqueEnum.SashimiSwordfish,
                    kind: 'elimination',
                    result: [4, 6, 5],
                    eliminations: [[4, 6, 5]],
                    reasonCells: [
                        [0, 0],
                        [1, 0],
                        [1, 3],
                        [3, 0],
                        [3, 3],
                        [3, 6],
                        [3, 7]
                    ]
                },
                {
                    technique: SolutionTechniqueEnum.SashimiSwordfish,
                    kind: 'elimination',
                    result: [3, 7, 5],
                    eliminations: [[3, 7, 5]],
                    reasonCells: [
                        [0, 0],
                        [1, 0],
                        [1, 3],
                        [3, 0],
                        [3, 3],
                        [3, 6],
                        [4, 6]
                    ]
                }
            ]
        );
    });
});
