import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';
import { BasicFishTechnique } from '../../basic-fish-technique/classes/basic-fish.technique';

import type { CandidateCellSpecType } from '../../@generic/types/candidate-cell-spec.spec.type';

describe('SwordfishTechnique', () => {
    it('finds three fish lines with three cover lines', () => {
        expect.assertions(1);

        const candidateSpecs: CandidateCellSpecType[] = [];

        for (const row of [0, 1, 2]) {
            for (const column of [0, 3, 6]) {
                candidateSpecs.push([row, column, [5, 9]]);
            }
        }

        const context = createCandidateContextFromMap(...candidateSpecs, [3, 0, [5, 8]], [3, 3, [5, 7]]);

        expectTechniqueResults(new BasicFishTechnique({ technique: SolutionTechniqueEnum.Swordfish, size: 3 }).find(context), {
            technique: SolutionTechniqueEnum.Swordfish,
            results: [
                [0, 0, 5],
                [1, 0, 5],
                [2, 0, 5],
                [3, 0, 5]
            ],
            eliminations: [
                [0, 0, 5],
                [0, 3, 5],
                [0, 6, 5],
                [1, 0, 5],
                [1, 3, 5],
                [1, 6, 5],
                [2, 0, 5],
                [2, 3, 5],
                [2, 6, 5],
                [3, 0, 5],
                [3, 3, 5]
            ]
        });
    });
});
