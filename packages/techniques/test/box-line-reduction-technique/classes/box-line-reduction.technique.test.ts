import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { CandidateContext } from '../../../src/@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';
import { BoxLineReductionTechnique } from '../../../src/box-line-reduction-technique/classes/box-line-reduction.technique';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

describe('BoxLineReductionTechnique', () => {
    it('finds a line candidate confined to one box', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '53.678912',
            '672195348',
            '19.342567',
            '85.761.23',
            '..6853791',
            '713924856',
            '.61537284',
            '287419635',
            '3.5286179'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expectTechniqueResults(context, new BoxLineReductionTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.BoxLineReduction,
                kind: 'elimination',
                result: [3, 2, 4],
                eliminations: [[3, 2, 4]],
                reasonCells: [
                    [4, 0],
                    [4, 1]
                ]
            }
        ]);
    });
});
