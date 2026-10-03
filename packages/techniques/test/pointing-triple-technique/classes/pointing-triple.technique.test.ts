import { describe, expect, it } from 'vitest';

import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';
import { PointingTechnique } from '../../../src/pointing-technique/classes/pointing.technique';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

describe('PointingTripleTechnique', () => {
    it('finds a box candidate triple confined to one line', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [5, 6]], [0, 1, [5, 7]], [0, 2, [5, 8]], [0, 3, [5, 9]]);

        expectTechniqueResults(context, new PointingTechnique({ technique: SolutionTechniqueEnum.PointingTriple, size: 3 }).find(context), [
            {
                technique: SolutionTechniqueEnum.PointingTriple,
                kind: 'elimination',
                result: [0, 3, 5],
                eliminations: [[0, 3, 5]],
                reasonCells: [
                    [0, 0],
                    [0, 1],
                    [0, 2]
                ]
            }
        ]);
    });
});
