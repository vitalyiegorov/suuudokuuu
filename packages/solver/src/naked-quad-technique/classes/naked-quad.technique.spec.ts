import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { NakedQuadTechnique } from './naked-quad.technique';

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

        expect(new NakedQuadTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.NakedQuad,
                eliminations: expect.arrayContaining([{ cell: { x: 6, y: 1, value: 0, group: 7 }, value: 5 }])
            })
        );
    });
});
