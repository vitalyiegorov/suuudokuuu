import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';
import { FinnedFishTechnique } from '../../finned-fish-technique/classes/finned-fish.technique';

describe('FinnedSwordfishTechnique', () => {
    it('finds a Swordfish with a same-box fin', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [0, 0, [5, 9]],
            [0, 3, [5, 9]],
            [0, 6, [5, 9]],
            [1, 0, [5, 9]],
            [1, 3, [5, 9]],
            [1, 6, [5, 9]],
            [3, 0, [5, 9]],
            [3, 3, [5, 9]],
            [3, 6, [5, 9]],
            [3, 7, [5, 9]],
            [4, 6, [5, 8]]
        );

        expectTechniqueResults(
            new FinnedFishTechnique({ technique: SolutionTechniqueEnum.FinnedSwordfish, size: 3, sashimi: false }).find(context),
            {
                technique: SolutionTechniqueEnum.FinnedSwordfish,
                results: [
                    [3, 7, 9],
                    [4, 6, 8]
                ],
                eliminations: [
                    [3, 7, 5],
                    [4, 6, 5]
                ]
            }
        );
    });

    it('targets only fish patterns that can justify the played cell', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [0, 0, [5, 9]],
            [0, 3, [5, 9]],
            [0, 6, [5, 9]],
            [1, 0, [5, 9]],
            [1, 3, [5, 9]],
            [1, 6, [5, 9]],
            [3, 0, [5, 9]],
            [3, 3, [5, 9]],
            [3, 6, [5, 9]],
            [3, 7, [5, 9]],
            [4, 6, [5, 8]]
        );
        const [targetCell] = context.getRowCells(4).slice(6, 7);

        expectTechniqueResults(
            new FinnedFishTechnique({ technique: SolutionTechniqueEnum.FinnedSwordfish, size: 3, sashimi: false }).findForMove(
                context,
                targetCell,
                8
            ),
            {
                technique: SolutionTechniqueEnum.FinnedSwordfish,
                results: [[4, 6, 8]],
                eliminations: [[4, 6, 5]]
            }
        );
    });
});
