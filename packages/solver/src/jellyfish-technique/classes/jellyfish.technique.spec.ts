import { describe, expect, it } from '@jest/globals';
import { createEmptyField, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { JellyfishTechnique } from './jellyfish.technique';

import type { CandidateMapType } from '../../@generic/types/candidate-map.type';

describe('JellyfishTechnique', () => {
    it('finds four fish lines with four cover lines', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {};

        for (const row of [0, 1, 2, 3]) {
            for (const column of [0, 3, 6, 8]) {
                candidateMap[CandidateContext.getCellKey(field[row][column])] = [5, 9];
            }
        }

        candidateMap[CandidateContext.getCellKey(field[4][0])] = [5, 8];
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);

        expect(new JellyfishTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.Jellyfish,
                eliminations: [{ cell: field[4][0], value: 5 }]
            })
        );
    });
});
