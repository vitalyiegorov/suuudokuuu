import { describe, expect, it } from '@jest/globals';
import { createEmptyField, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { WWingTechnique } from './w-wing.technique';

import type { CandidateMapType } from '../../@generic/types/candidate-map.type';

describe('WWingTechnique', () => {
    it('finds matching bivalue cells connected by a strong link', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [CandidateContext.getCellKey(field[3][0])]: [1, 2],
            [CandidateContext.getCellKey(field[4][4])]: [1, 2],
            [CandidateContext.getCellKey(field[3][8])]: [1, 5],
            [CandidateContext.getCellKey(field[4][8])]: [1, 6],
            [CandidateContext.getCellKey(field[4][0])]: [2, 9]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);

        expect(new WWingTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.WWing,
                eliminations: [{ cell: field[4][0], value: 2 }]
            })
        );
    });
});
