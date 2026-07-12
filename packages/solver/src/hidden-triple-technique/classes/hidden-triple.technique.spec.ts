import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';
import { HiddenSubsetTechnique } from '../../hidden-subset-technique/classes/hidden-subset.technique';

describe('HiddenTripleTechnique', () => {
    it('finds a triple hidden inside three cells', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '.34678912',
            '6.219534.',
            '1.834256.',
            '.59761423',
            '4.68.3791',
            '713924856',
            '.6.53.284',
            '2.741963.',
            '3.528..7.'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expectTechniqueResults(new HiddenSubsetTechnique({ technique: SolutionTechniqueEnum.HiddenTriple, size: 3 }).find(context), {
            technique: SolutionTechniqueEnum.HiddenTriple,
            results: [
                [1, 8, 8],
                [2, 1, 9],
                [8, 1, 4]
            ],
            eliminations: [
                [1, 8, 7],
                [2, 1, 7],
                [8, 1, 9]
            ]
        });
    });
});
