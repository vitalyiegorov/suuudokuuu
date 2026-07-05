import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { CandidateContext } from '../candidate-context/candidate-context';

import { HiddenTripleTechnique } from './hidden-triple.technique';

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

        expect(new HiddenTripleTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.HiddenTriple,
                eliminations: expect.arrayContaining([{ cell: { x: 1, y: 8, value: 0, group: 3 }, value: 9 }])
            })
        );
    });
});
