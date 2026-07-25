import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

import { FullHouseTechnique } from './full-house.technique';

describe('FullHouseTechnique', () => {
    it('finds a cell that completes a unit with one blank', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '12345678.',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expectTechniqueResults(context, new FullHouseTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.FullHouse,
                kind: 'placement',
                result: [0, 8, 9],
                eliminations: [],
                reasonCells: [
                    [0, 0],
                    [0, 1],
                    [0, 2],
                    [0, 3],
                    [0, 4],
                    [0, 5],
                    [0, 6],
                    [0, 7],
                    [0, 8]
                ]
            }
        ]);
    });
});
