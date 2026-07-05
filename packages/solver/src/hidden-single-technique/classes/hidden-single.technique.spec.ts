import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { HiddenSingleTechnique } from './hidden-single.technique';

describe('HiddenSingleTechnique', () => {
    it('finds a value that only one cell can hold in a unit', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '.3.678912',
            '672.95348',
            '1983425.7',
            '8597.142.',
            '.268537.1',
            '7.3924856',
            '961537284',
            '287419635',
            '34.286179'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expect(new HiddenSingleTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.HiddenSingle,
                cell: { x: 0, y: 0, value: 0, group: 1 },
                value: 5
            })
        );
    });
});
