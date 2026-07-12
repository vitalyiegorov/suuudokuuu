import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

import { XChainTechnique } from './x-chain.technique';

describe('XChainTechnique', () => {
    it('finds an alternating strong-link chain that removes the endpoint value', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [5, 6]], [0, 3, [5, 7]], [1, 3, [5, 8]], [1, 1, [5, 9]], [2, 2, [5, 4]]);

        expectTechniqueResults(new XChainTechnique().find(context), {
            technique: SolutionTechniqueEnum.XChain,
            results: [[2, 2, 5]],
            eliminations: [[2, 2, 5]]
        });
    });

    it('finds a chain with a weak-only middle link', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [0, 0, [5, 6]],
            [0, 4, [5, 7]],
            [1, 4, [5, 8]],
            [1, 1, [5, 9]],
            [2, 4, [5, 1]],
            [2, 2, [5, 4]]
        );

        const normalizedResults = new XChainTechnique().find(context).map(result => ({
            eliminations: result.eliminations.map(elimination => [elimination.cell.y, elimination.cell.x, elimination.value]),
            reasonCells: result.reasonCells.map(cell => [cell.y, cell.x]).sort()
        }));

        expect(normalizedResults).toContainEqual({
            eliminations: [[2, 2, 5]],
            reasonCells: [
                [0, 0],
                [0, 4],
                [1, 1],
                [1, 4]
            ]
        });
    });

    it('finds an alternating chain longer than six cells', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [0, 0, [5, 1]],
            [0, 3, [5, 2]],
            [3, 3, [5, 3]],
            [3, 6, [5, 4]],
            [6, 6, [5, 6]],
            [6, 8, [5, 7]],
            [8, 8, [5, 8]],
            [8, 0, [5, 9]],
            [5, 3, [5, 1]],
            [5, 6, [5, 2]],
            [5, 8, [5, 3]],
            [4, 0, [5, 4]]
        );

        const normalizedResults = new XChainTechnique().find(context).map(result => ({
            eliminations: result.eliminations.map(elimination => [elimination.cell.y, elimination.cell.x, elimination.value]),
            reasonCells: result.reasonCells.map(cell => [cell.y, cell.x]).sort()
        }));

        expect(normalizedResults).toContainEqual({
            eliminations: [[4, 0, 5]],
            reasonCells: [
                [0, 0],
                [0, 3],
                [3, 3],
                [3, 6],
                [6, 6],
                [6, 8],
                [8, 0],
                [8, 8]
            ]
        });
    });

    it('ignores a chain when a strong link gains a third occurrence', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [0, 0, [5, 6]],
            [0, 3, [5, 7]],
            [0, 6, [5, 1]],
            [1, 3, [5, 8]],
            [1, 1, [5, 9]],
            [2, 2, [5, 4]]
        );
        const results = new XChainTechnique().find(context);

        expect(results.some(result => result.technique === SolutionTechniqueEnum.XChain)).toBe(false);
    });
});
