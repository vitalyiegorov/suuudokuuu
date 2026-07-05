import { describe, expect, it } from '@jest/globals';
import { createEmptyField, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { CandidateContext } from '../candidate-context/candidate-context';

import { SashimiXWingTechnique } from './sashimi-x-wing.technique';

import type { CandidateMapType } from '../../../types/candidate-map.type';

describe('SashimiXWingTechnique', () => {
    it('finds an X-Wing where one base line has one body candidate', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [CandidateContext.getCellKey(field[0][0])]: [5, 6],
            [CandidateContext.getCellKey(field[0][1])]: [5, 7],
            [CandidateContext.getCellKey(field[1][0])]: [5, 6],
            [CandidateContext.getCellKey(field[1][4])]: [5, 8],
            [CandidateContext.getCellKey(field[2][0])]: [5, 9]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);

        expect(new SashimiXWingTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.SashimiXWing,
                eliminations: [{ cell: field[2][0], value: 5 }]
            })
        );
    });
});
