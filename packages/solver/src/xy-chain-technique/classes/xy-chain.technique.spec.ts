import { describe, expect, it } from '@jest/globals';
import { createEmptyField, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { XYChainTechnique } from './xy-chain.technique';

import type { CandidateMapType } from '../../@generic/types/candidate-map.type';

describe('XYChainTechnique', () => {
    it('finds a bivalue chain that removes the endpoint value from common peers', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [CandidateContext.getCellKey(field[0][0])]: [1, 2],
            [CandidateContext.getCellKey(field[0][1])]: [2, 3],
            [CandidateContext.getCellKey(field[1][1])]: [1, 3],
            [CandidateContext.getCellKey(field[2][2])]: [1, 4]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);

        expect(new XYChainTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.XYChain,
                eliminations: [{ cell: field[2][2], value: 1 }]
            })
        );
    });
});
