import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { Sudoku } from '../../sudoku/sudoku';

import { HiddenPairTechnique } from './hidden-pair.technique';

describe('HiddenPairTechnique', () => {
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
        const technique = new HiddenPairTechnique(game);

        expect(technique.type).toBe(SolutionTechniqueEnum.HiddenPair);
        expect(technique.difficulty).toBe(5);
    });

    it('should apply technique to appropriate cells', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
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
        const technique = new HiddenPairTechnique(game);

        expect(technique.canApply(game.Field[0][0], [3, 5])).toBe(true);
    });

    it('should not apply to solved field', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '123456789',
            '456789123',
            '789123456',
            '234567891',
            '567891234',
            '891234567',
            '345678912',
            '678912345',
            '912345678'
        );
        const technique = new HiddenPairTechnique(game);

        expect(technique.canApply(game.Field[0][0], [])).toBe(false);
    });

    it('should not apply to nearly empty field', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
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
        const technique = new HiddenPairTechnique(game);

        expect(technique.canApply(game.Field[0][1], game.getCellCandidates(game.Field[0][1], game.Field))).toBe(false);
    });
});
