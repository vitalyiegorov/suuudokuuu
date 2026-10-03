import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { CandidateContext } from '../../../src/@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';
import { NakedSubsetTechnique } from '../../../src/naked-subset-technique/classes/naked-subset.technique';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

describe('NakedPairTechnique', () => {
    it('finds a pair whose candidates can be removed from peers', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '.34.7.91.',
            '672195348',
            '.9.34.567',
            '859761423',
            '426.5379.',
            '713924856',
            '961537284',
            '287419635',
            '345286179'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expectTechniqueResults(context, new NakedSubsetTechnique({ technique: SolutionTechniqueEnum.NakedPair, size: 2 }).find(context), [
            {
                technique: SolutionTechniqueEnum.NakedPair,
                kind: 'elimination',
                result: [0, 3, 8],
                eliminations: [[0, 3, 8]],
                reasonCells: [
                    [0, 5],
                    [2, 5]
                ]
            }
        ]);
    });

    it('ignores a pair when one cell has a third candidate', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2, 3]], [0, 1, [1, 2]], [0, 2, [1, 4]]);
        const results = new NakedSubsetTechnique({ technique: SolutionTechniqueEnum.NakedPair, size: 2 }).find(context);

        expect(results.some(result => result.technique === SolutionTechniqueEnum.NakedPair)).toBe(false);
    });
});
