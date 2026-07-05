import { describe, expect, it } from '@jest/globals';
import { createEmptyField, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { CandidateContext } from '../candidate-context/candidate-context';

import { XYZWingTechnique } from './xyz-wing.technique';

import type { CandidateMapType } from '../../../types/candidate-map.type';

describe('XYZWingTechnique', () => {
    it('finds a three-candidate pivot with two restricted pincers', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [CandidateContext.getCellKey(field[0][0])]: [1, 2, 3],
            [CandidateContext.getCellKey(field[1][1])]: [3, 4],
            [CandidateContext.getCellKey(field[0][1])]: [1, 3],
            [CandidateContext.getCellKey(field[1][0])]: [2, 3]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);

        expect(new XYZWingTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.XYZWing,
                eliminations: [{ cell: field[1][1], value: 3 }]
            })
        );
    });
});
