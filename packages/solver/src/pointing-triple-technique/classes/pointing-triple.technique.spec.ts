import { describe, expect, it } from '@jest/globals';
import { createEmptyField, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { PointingTripleTechnique } from './pointing-triple.technique';

import type { CandidateMapType } from '../../@generic/types/candidate-map.type';

describe('PointingTripleTechnique', () => {
    it('finds a box candidate triple confined to one line', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [CandidateContext.getCellKey(field[0][0])]: [5, 6],
            [CandidateContext.getCellKey(field[0][1])]: [5, 7],
            [CandidateContext.getCellKey(field[0][2])]: [5, 8],
            [CandidateContext.getCellKey(field[0][3])]: [5, 9]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);

        expect(new PointingTripleTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.PointingTriple,
                eliminations: [{ cell: field[0][3], value: 5 }]
            })
        );
    });
});
