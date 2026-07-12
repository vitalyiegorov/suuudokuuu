import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';
import { NakedSubsetTechnique } from '../../naked-subset-technique/classes/naked-subset.technique';

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

        expectTechniqueResults(new NakedSubsetTechnique({ technique: SolutionTechniqueEnum.NakedPair, size: 2 }).find(context), {
            technique: SolutionTechniqueEnum.NakedPair,
            results: [[0, 3, 6]],
            eliminations: [[0, 3, 8]]
        });
    });

    it('ignores a pair when one cell has a third candidate', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2, 3]], [0, 1, [1, 2]], [0, 2, [1, 4]]);
        const results = new NakedSubsetTechnique({ technique: SolutionTechniqueEnum.NakedPair, size: 2 }).find(context);

        expect(results.some(result => result.technique === SolutionTechniqueEnum.NakedPair)).toBe(false);
    });
});
