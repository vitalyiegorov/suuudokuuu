import { describe, expect, it } from '@jest/globals';
import { createEmptyField, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { CandidateContext } from '../candidate-context/candidate-context';

import { XChainTechnique } from './x-chain.technique';

import type { CandidateMapType } from '../../../types/candidate-map.type';

describe('XChainTechnique', () => {
    it('finds an alternating strong-link chain that removes the endpoint value', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [CandidateContext.getCellKey(field[0][0])]: [5, 6],
            [CandidateContext.getCellKey(field[0][3])]: [5, 7],
            [CandidateContext.getCellKey(field[1][3])]: [5, 8],
            [CandidateContext.getCellKey(field[1][1])]: [5, 9],
            [CandidateContext.getCellKey(field[2][2])]: [5, 4]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);

        expect(new XChainTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.XChain,
                eliminations: [{ cell: field[2][2], value: 5 }]
            })
        );
    });

    it('ignores a chain when a strong link gains a third occurrence', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [CandidateContext.getCellKey(field[0][0])]: [5, 6],
            [CandidateContext.getCellKey(field[0][3])]: [5, 7],
            [CandidateContext.getCellKey(field[0][6])]: [5, 1],
            [CandidateContext.getCellKey(field[1][3])]: [5, 8],
            [CandidateContext.getCellKey(field[1][1])]: [5, 9],
            [CandidateContext.getCellKey(field[2][2])]: [5, 4]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);
        const results = new XChainTechnique().find(context);

        expect(results.some(result => result.technique === SolutionTechniqueEnum.XChain)).toBe(false);
    });
});
