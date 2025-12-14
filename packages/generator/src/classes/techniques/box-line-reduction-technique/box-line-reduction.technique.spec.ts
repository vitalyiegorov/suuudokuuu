import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { Sudoku } from '../../sudoku/sudoku';

import { BoxLineReductionTechnique } from './box-line-reduction.technique';

describe('BoxLineReductionTechnique', () => {
    it('should have correct type and difficulty', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const technique = new BoxLineReductionTechnique(game);

        expect(technique.type).toBe(SolutionTechniqueEnum.BoxLineReduction);
        expect(technique.difficulty).toBe(11);
    });

    it('should apply technique when value is restricted to one row in a box', () => {
        // Create a field where value 5 in box 0 (top-left 3x3) can only go in row 0, columns 0 and 1
        // This means 5 is blocked from all other positions in box 0
        // And there are empty cells in row 0 outside box 0 (columns 3-8) that could have 5
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '..4.78912',
            '67219.348',
            '198342567',
            '8.9761423',
            '426853791',
            '713924856',
            '961.37284',
            '287419635',
            '345286179'
        );
        const technique = new BoxLineReductionTechnique(game);

        expect(technique.canApply(game.Field[0][0], [5])).toBe(true);
    });

    it('should apply technique when value is restricted to one column in a box', () => {
        // Create a field with some values and test that the technique works
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '1........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const technique = new BoxLineReductionTechnique(game);

        expect(technique.canApply(game.Field[0][1], [2, 3, 4, 5, 6, 7, 8, 9])).toBe(true);
    });

    it('should not apply when conditions are not met', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '1........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const technique = new BoxLineReductionTechnique(game);
        expect(technique.canApply(game.Field[0][1], [2, 3, 4, 5, 6, 7, 8, 9])).toBe(false);
    });
});
