import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

import { AICTechnique } from './aic.technique';

import type { CandidateCellSpecType } from '../../@generic/types/candidate-cell-spec.spec.type';

const aicCandidateSpecs: CandidateCellSpecType[] = [
    [0, 0, [1, 2]],
    [0, 3, [1, 2]],
    [0, 8, [1, 3]]
];

const expectChainResult = (candidateSpecs: CandidateCellSpecType[]): void => {
    const context = createCandidateContextFromMap(...candidateSpecs);

    expectTechniqueResults(context, new AICTechnique().find(context), [
        {
            technique: SolutionTechniqueEnum.AIC,
            kind: 'elimination',
            result: [0, 8, 1],
            eliminations: [[0, 8, 1]],
            reasonCells: [
                [0, 0],
                [0, 3]
            ]
        }
    ]);
};

describe('AICTechnique', () => {
    it('finds a chain with mixed cell and unit links', () => {
        expect.assertions(1);

        expectChainResult(aicCandidateSpecs);
    });

    it('rejects the chain when the first cell link is no longer strong', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2, 4]], [0, 3, [1, 2]], [0, 8, [1, 3]]);
        const results = new AICTechnique().find(context);

        expect(results).toEqual([]);
    });

    it('rejects the chain when the second cell link is no longer strong', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2]], [0, 3, [1, 2, 4]], [0, 8, [1, 3]]);
        const results = new AICTechnique().find(context);

        expect(results).toEqual([]);
    });

    it('finds a targeted deduction that leaves the played value', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2]], [0, 3, [1, 2]], [0, 4, [1, 6]]);
        const [targetCell] = context.getRowCells(0).slice(4, 5);

        expectTechniqueResults(context, new AICTechnique().find(context, { cell: targetCell, value: 6 }), [
            {
                technique: SolutionTechniqueEnum.AIC,
                kind: 'elimination',
                result: [0, 4, 1],
                eliminations: [[0, 4, 1]],
                reasonCells: [
                    [0, 0],
                    [0, 3]
                ]
            }
        ]);
    });

    it('does not report a targeted elimination that leaves another alternative', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2]], [0, 3, [1, 2]], [0, 4, [1, 5, 6]]);
        const [targetCell] = context.getRowCells(0).slice(4, 5);

        expect(new AICTechnique().find(context, { cell: targetCell, value: 6 })).toEqual([]);
    });
});
