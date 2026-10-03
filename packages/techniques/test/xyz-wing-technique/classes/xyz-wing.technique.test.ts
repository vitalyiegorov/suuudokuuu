import { describe, expect, it } from 'vitest';

import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';
import { XYZWingTechnique } from '../../../src/xyz-wing-technique/classes/xyz-wing.technique';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';


describe('XYZWingTechnique', () => {
    it('finds a three-candidate pivot with two restricted pincers', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2, 3]], [1, 1, [3, 4]], [0, 1, [1, 3]], [1, 0, [2, 3]]);

        expectTechniqueResults(context, new XYZWingTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.XYZWing,
                kind: 'elimination',
                result: [1, 1, 3],
                eliminations: [[1, 1, 3]],
                reasonCells: [
                    [0, 0],
                    [0, 1],
                    [1, 0]
                ]
            }
        ]);
    });
});
