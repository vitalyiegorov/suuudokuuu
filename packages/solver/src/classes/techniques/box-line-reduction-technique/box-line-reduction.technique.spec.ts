import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { CandidateContext } from '../candidate-context/candidate-context';

import { BoxLineReductionTechnique } from './box-line-reduction.technique';

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

        expect(new BoxLineReductionTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.BoxLineReduction,
                eliminations: expect.arrayContaining([{ cell: { x: 2, y: 3, value: 0, group: 2 }, value: 4 }])
            })
        );
    });
});
