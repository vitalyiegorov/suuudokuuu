import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { expectTechniqueElimination } from '../../@generic/test-utils/expect-technique-elimination.spec.util';
import { HiddenSubsetTechnique } from '../../hidden-subset-technique/classes/hidden-subset.technique';

describe('HiddenPairTechnique', () => {
    it('finds a pair hidden inside two cells', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '5.46..912',
            '67219.34.',
            '1983.2567',
            '859761423',
            '4268.3791',
            '713924.56',
            '96153728.',
            '287419635',
            '345286179'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expectTechniqueElimination(new HiddenSubsetTechnique({ technique: SolutionTechniqueEnum.HiddenPair, size: 2 }).find(context), {
            technique: SolutionTechniqueEnum.HiddenPair,
            rowIndex: 1,
            columnIndex: 5,
            value: 8
        });
    });
});
