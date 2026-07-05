import { describe, expect, it } from '@jest/globals';
import { createEmptyField, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { CandidateContext } from '../candidate-context/candidate-context';

import { FinnedSwordfishTechnique } from './finned-swordfish.technique';

import type { CandidateMapType } from '../../../types/candidate-map.type';

describe('FinnedSwordfishTechnique', () => {
    it('finds a Swordfish with a same-box fin', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [CandidateContext.getCellKey(field[0][0])]: [5, 9],
            [CandidateContext.getCellKey(field[0][3])]: [5, 9],
            [CandidateContext.getCellKey(field[0][6])]: [5, 9],
            [CandidateContext.getCellKey(field[1][0])]: [5, 9],
            [CandidateContext.getCellKey(field[1][3])]: [5, 9],
            [CandidateContext.getCellKey(field[1][6])]: [5, 9],
            [CandidateContext.getCellKey(field[3][0])]: [5, 9],
            [CandidateContext.getCellKey(field[3][3])]: [5, 9],
            [CandidateContext.getCellKey(field[3][6])]: [5, 9],
            [CandidateContext.getCellKey(field[3][7])]: [5, 9],
            [CandidateContext.getCellKey(field[4][6])]: [5, 8]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);

        expect(new FinnedSwordfishTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.FinnedSwordfish,
                eliminations: expect.arrayContaining([{ cell: field[4][6], value: 5 }])
            })
        );
    });
});
