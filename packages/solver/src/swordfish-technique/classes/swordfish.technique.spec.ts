import { describe, expect, it } from '@jest/globals';
import { createEmptyField, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { SwordfishTechnique } from './swordfish.technique';

import type { CandidateMapType } from '../../@generic/types/candidate-map.type';

describe('SwordfishTechnique', () => {
    it('finds three fish lines with three cover lines', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {};

        for (const row of [0, 1, 2]) {
            for (const column of [0, 3, 6]) {
                candidateMap[CandidateContext.getCellKey(field[row][column])] = [5, 9];
            }
        }

        candidateMap[CandidateContext.getCellKey(field[3][0])] = [5, 8];
        candidateMap[CandidateContext.getCellKey(field[3][3])] = [5, 7];
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);

        expect(new SwordfishTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.Swordfish,
                eliminations: expect.arrayContaining([{ cell: field[3][0], value: 5 }])
            })
        );
    });
});
