import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

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

        expectTechniqueResults(context, new HiddenSingleTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.HiddenSingle,
                kind: 'placement',
                result: [0, 0, 5],
                eliminations: [],
                reasonCells: [
                    [0, 0],
                    [1, 0],
                    [2, 0],
                    [3, 0],
                    [4, 0],
                    [5, 0],
                    [6, 0],
                    [7, 0],
                    [8, 0]
                ]
            },
            {
                technique: SolutionTechniqueEnum.HiddenSingle,
                kind: 'placement',
                result: [0, 2, 4],
                eliminations: [],
                reasonCells: [
                    [0, 2],
                    [1, 2],
                    [2, 2],
                    [3, 2],
                    [4, 2],
                    [5, 2],
                    [6, 2],
                    [7, 2],
                    [8, 2]
                ]
            }
        ]);
    });
});
