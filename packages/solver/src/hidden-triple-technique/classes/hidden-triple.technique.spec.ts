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

        expectTechniqueResults(
            context,
            new HiddenSubsetTechnique({ technique: SolutionTechniqueEnum.HiddenTriple, size: 3 }).find(context),
            [
                {
                    technique: SolutionTechniqueEnum.HiddenTriple,
                    kind: 'elimination',
                    result: [8, 1, 9],
                    eliminations: [[8, 1, 9]],
                    reasonCells: [
                        [4, 1],
                        [7, 1],
                        [8, 1]
                    ]
                },
                {
                    technique: SolutionTechniqueEnum.HiddenTriple,
                    kind: 'elimination',
                    result: [2, 1, 7],
                    eliminations: [[2, 1, 7]],
                    reasonCells: [
                        [2, 1],
                        [4, 1],
                        [8, 1]
                    ]
                },
                {
                    technique: SolutionTechniqueEnum.HiddenTriple,
                    kind: 'elimination',
                    result: [2, 1, 7],
                    eliminations: [[2, 1, 7]],
                    reasonCells: [
                        [2, 1],
                        [7, 1],
                        [8, 1]
                    ]
                },
                {
                    technique: SolutionTechniqueEnum.HiddenTriple,
                    kind: 'elimination',
                    result: [8, 1, 9],
                    eliminations: [[8, 1, 9]],
                    reasonCells: [
                        [8, 1],
                        [8, 5],
                        [8, 6]
                    ]
                },
                {
                    technique: SolutionTechniqueEnum.HiddenTriple,
                    kind: 'elimination',
                    result: [1, 8, 7],
                    eliminations: [[1, 8, 7]],
                    reasonCells: [
                        [1, 8],
                        [7, 8],
                        [8, 8]
                    ]
                },
                {
                    technique: SolutionTechniqueEnum.HiddenTriple,
                    kind: 'elimination',
                    result: [8, 1, 9],
                    eliminations: [[8, 1, 9]],
                    reasonCells: [
                        [6, 2],
                        [7, 1],
                        [8, 1]
                    ]
                }
            ]
        );
    });
});
