import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';
import { HiddenSubsetTechnique } from '../../hidden-subset-technique/classes/hidden-subset.technique';

describe('HiddenQuadTechnique', () => {
    it('finds a quad hidden inside four cells', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '534678.12',
            '672195348',
            '1983.25.7',
            '8.9...42.',
            '4268..7.1',
            '.13..4856',
            '961537.84',
            '28.4.9635',
            '345286179'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expectTechniqueResults(new HiddenSubsetTechnique({ technique: SolutionTechniqueEnum.HiddenQuad, size: 4 }).find(context), {
            technique: SolutionTechniqueEnum.HiddenQuad,
            results: [
                [3, 4, 1],
                [3, 4, 5],
                [3, 4, 6],
                [3, 5, 1],
                [5, 3, 9]
            ],
            eliminations: [
                [3, 4, 1],
                [3, 4, 5],
                [3, 5, 3],
                [5, 3, 7]
            ]
        });
    });
});
