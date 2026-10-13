import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { CandidateContext } from '../../../src/@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';
import { wasContextSearchCapped } from '../../../src/@generic/utils/context-scan-state.util';
import { AICTechnique } from '../../../src/aic-technique/classes/aic.technique';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

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
    it('retains distinct candidates when a valid path revisits a cell', () => {
        const context = CandidateContext.fromSudoku(
            Sudoku.fromString('000000051000000023004005000000000600000130000007680000429006500370400000810000000', defaultSudokuConfig)
        );
        const result = new AICTechnique().find(context).find(candidate => candidate.cell.y === 1 && candidate.cell.x === 5);

        expect(result).toBeDefined();
        expect(result?.chain?.[1].cell).toBe(result?.chain?.[7].cell);
        expect(result?.chain?.[7].value).not.toBe(result?.chain?.[1].value);
    });
    it('keeps the ordered candidate path before depth-first search pops it', () => {
        const context = createCandidateContextFromMap(...aicCandidateSpecs);
        const [result] = new AICTechnique().find(context);

        expect(result.chain?.map(node => [node.cell.y, node.cell.x, node.value, node.link])).toEqual([
            [0, 0, 1, undefined],
            [0, 0, 2, 'STRONG'],
            [0, 3, 2, 'WEAK'],
            [0, 3, 1, 'STRONG']
        ]);
    });
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

        expectTechniqueResults(context, new AICTechnique().find(context, { cell: targetCell, value: 6, intent: 'direct' }), [
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

        expect(new AICTechnique().find(context, { cell: targetCell, value: 6, intent: 'direct' })).toEqual([]);
    });

    it('continues to later start nodes after an earlier real-board search exhausts its visit budget', () => {
        const context = CandidateContext.fromSudoku(
            Sudoku.fromString('504678900670095348098340567859760403406853790703904856960537084087409635345086079', defaultSudokuConfig)
        );

        const results = new AICTechnique().find(context);

        expect(wasContextSearchCapped(context)).toBe(true);
        expect(results.map(result => [result.cell.y, result.cell.x, result.value])).toEqual([
            [0, 1, 1],
            [0, 1, 2]
        ]);
    });
});
