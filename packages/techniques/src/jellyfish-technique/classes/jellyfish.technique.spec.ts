import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';
import { BasicFishTechnique } from '../../basic-fish-technique/classes/basic-fish.technique';

import type { CandidateCellSpecType } from '../../@generic/types/candidate-cell-spec.spec.type';

describe('JellyfishTechnique', () => {
    it('finds four fish lines with four cover lines', () => {
        expect.assertions(1);

        const candidateSpecs: CandidateCellSpecType[] = [];

        for (const row of [0, 1, 2, 3]) {
            for (const column of [0, 3, 6, 8]) {
                candidateSpecs.push([row, column, [5, 9]]);
            }
        }

        const context = createCandidateContextFromMap(...candidateSpecs, [4, 0, [5, 8]]);

        expectTechniqueResults(context, new BasicFishTechnique({ technique: SolutionTechniqueEnum.Jellyfish, size: 4 }).find(context), [
            {
                technique: SolutionTechniqueEnum.Jellyfish,
                kind: 'elimination',
                result: [4, 0, 5],
                eliminations: [[4, 0, 5]],
                reasonCells: [
                    [0, 0],
                    [0, 3],
                    [0, 6],
                    [0, 8],
                    [1, 0],
                    [1, 3],
                    [1, 6],
                    [1, 8],
                    [2, 0],
                    [2, 3],
                    [2, 6],
                    [2, 8],
                    [3, 0],
                    [3, 3],
                    [3, 6],
                    [3, 8]
                ]
            }
        ]);
    });
});
