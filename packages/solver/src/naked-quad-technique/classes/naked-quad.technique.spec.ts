import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { expectTechniqueElimination } from '../../@generic/test-utils/expect-technique-elimination.spec.util';
import { NakedSubsetTechnique } from '../../naked-subset-technique/classes/naked-subset.technique';

describe('NakedQuadTechnique', () => {
    it('finds a quad whose candidates can be removed from peers', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '534678912',
            '.72.9....',
            '.9.342.6.',
            '85976.423',
            '426853.91',
            '7139248.6',
            '.6153728.',
            '287419635',
            '34528617.'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expectTechniqueElimination(new NakedSubsetTechnique({ technique: SolutionTechniqueEnum.NakedQuad, size: 4 }).find(context), {
            technique: SolutionTechniqueEnum.NakedQuad,
            rowIndex: 1,
            columnIndex: 6,
            value: 5
        });
    });
});
