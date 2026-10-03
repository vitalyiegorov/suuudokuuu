import { describe, expect, it } from 'vitest';

import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';
import { FinnedFishTechnique } from '../../../src/finned-fish-technique/classes/finned-fish.technique';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

describe('SashimiXWingTechnique', () => {
    it('finds an X-Wing where one base line has one body candidate', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [5, 6]], [0, 1, [5, 7]], [1, 0, [5, 6]], [1, 4, [5, 8]], [2, 0, [5, 9]]);

        expectTechniqueResults(
            context,
            new FinnedFishTechnique({ technique: SolutionTechniqueEnum.SashimiXWing, size: 2, sashimi: true }).find(context),
            [
                {
                    technique: SolutionTechniqueEnum.SashimiXWing,
                    kind: 'elimination',
                    result: [2, 0, 5],
                    eliminations: [[2, 0, 5]],
                    reasonCells: [
                        [0, 0],
                        [0, 1],
                        [1, 0],
                        [1, 4]
                    ]
                },
                {
                    technique: SolutionTechniqueEnum.SashimiXWing,
                    kind: 'elimination',
                    result: [0, 1, 5],
                    eliminations: [[0, 1, 5]],
                    reasonCells: [
                        [0, 0],
                        [1, 0],
                        [1, 4],
                        [2, 0]
                    ]
                }
            ]
        );
    });
});
