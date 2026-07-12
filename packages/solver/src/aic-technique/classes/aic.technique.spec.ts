import { describe, expect, it } from '@jest/globals';

import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';

import { AICTechnique } from './aic.technique';

import type { CandidateCellSpecType } from '../../@generic/types/candidate-cell-spec.spec.type';

const aicCandidateSpecs: CandidateCellSpecType[] = [
    [0, 0, [1, 2]],
    [0, 3, [2, 5, 6]],
    [4, 3, [2, 3, 9]],
    [7, 3, [3, 8, 9]],
    [7, 4, [1, 3]],
    [0, 4, [1, 6]],
    [0, 8, [1, 7]],
    [8, 4, [1, 9]]
];

const expectedChainResult = {
    eliminations: [[0, 4, 1]],
    reasonCells: [
        [0, 0],
        [0, 0],
        [0, 3],
        [4, 3],
        [4, 3],
        [7, 3],
        [7, 4],
        [7, 4]
    ]
};

const normalizeResults = (technique: AICTechnique, candidateSpecs: CandidateCellSpecType[]) => {
    const context = createCandidateContextFromMap(...candidateSpecs);

    return technique.find(context).map(result => ({
        eliminations: result.eliminations.map(elimination => [elimination.cell.y, elimination.cell.x, elimination.value]),
        reasonCells: result.reasonCells.map(cell => [cell.y, cell.x])
    }));
};

describe('AICTechnique', () => {
    it('finds an eight-node chain with mixed cell and unit links', () => {
        expect.assertions(1);

        const normalizedResults = normalizeResults(new AICTechnique(), aicCandidateSpecs);

        expect(normalizedResults).toContainEqual(expectedChainResult);
    });

    it('rejects the chain when the value-two unit link is no longer strong', () => {
        expect.assertions(1);

        const normalizedResults = normalizeResults(new AICTechnique(), [...aicCandidateSpecs, [8, 3, [2, 4]]]);

        expect(normalizedResults).not.toContainEqual(expectedChainResult);
    });

    it('rejects the chain when the value-three unit link is no longer strong', () => {
        expect.assertions(1);

        const normalizedResults = normalizeResults(new AICTechnique(), [...aicCandidateSpecs, [1, 3, [3, 4]]]);

        expect(normalizedResults).not.toContainEqual(expectedChainResult);
    });
});
