import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

import { XYChainTechnique } from './xy-chain.technique';

describe('XYChainTechnique', () => {
    it('finds a bivalue chain that removes the endpoint value from common peers', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2]], [0, 1, [2, 3]], [1, 1, [1, 3]], [2, 2, [1, 4]]);

        expectTechniqueResults(new XYChainTechnique().find(context), {
            technique: SolutionTechniqueEnum.XYChain,
            results: [[2, 2, 4]],
            eliminations: [[2, 2, 1]]
        });
    });

    it('finds chains longer than six cells', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [0, 0, [1, 2]],
            [0, 3, [2, 3]],
            [3, 3, [3, 4]],
            [3, 6, [4, 5]],
            [6, 6, [5, 6]],
            [6, 8, [6, 7]],
            [8, 8, [1, 7]],
            [0, 8, [1, 8, 9]]
        );
        const normalizedResults = new XYChainTechnique().find(context).map(result => ({
            eliminations: result.eliminations.map(elimination => [elimination.cell.y, elimination.cell.x, elimination.value]),
            reasonCells: result.reasonCells.map(cell => [cell.y, cell.x])
        }));

        expect(normalizedResults).toContainEqual({
            eliminations: [[0, 8, 1]],
            reasonCells: [
                [0, 0],
                [0, 3],
                [3, 3],
                [3, 6],
                [6, 6],
                [6, 8],
                [8, 8]
            ]
        });
    });
});
