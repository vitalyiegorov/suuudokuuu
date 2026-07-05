import { describe, expect, it } from '@jest/globals';
import { createEmptyField, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { NakedTripleTechnique } from './naked-triple.technique';

import type { CandidateMapType } from '../../@generic/types/candidate-map.type';

describe('NakedTripleTechnique', () => {
    it('finds a triple whose candidates can be removed from peers', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [CandidateContext.getCellKey(field[0][0])]: [1, 2],
            [CandidateContext.getCellKey(field[0][1])]: [2, 3],
            [CandidateContext.getCellKey(field[0][2])]: [1, 3],
            [CandidateContext.getCellKey(field[0][3])]: [1, 4]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);

        expect(new NakedTripleTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.NakedTriple,
                eliminations: [{ cell: field[0][3], value: 1 }]
            })
        );
    });
});
