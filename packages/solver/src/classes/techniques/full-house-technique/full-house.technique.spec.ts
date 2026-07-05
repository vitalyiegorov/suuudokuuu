import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { CandidateContext } from '../candidate-context/candidate-context';

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

        expect(new FullHouseTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.FullHouse,
                cell: sudoku.Field[0][8],
                value: 9
            })
        );
    });
});
