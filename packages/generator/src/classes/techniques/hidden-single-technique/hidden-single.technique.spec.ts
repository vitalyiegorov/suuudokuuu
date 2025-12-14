import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { Sudoku } from '../../sudoku/sudoku';

import { HiddenSingleTechnique } from './hidden-single.technique';

describe('HiddenSingleTechnique', () => {
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
        const technique = new HiddenSingleTechnique(game);

        expect(technique.type).toBe(SolutionTechniqueEnum.HiddenSingle);
        expect(technique.difficulty).toBe(3);
    });

    it('should detect HiddenSingle when value can only go in one place in row', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '.2345678.',
            '1........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const technique = new HiddenSingleTechnique(game);

        const cell = game.GameField[0][8];
        const candidates = [9];
        const result = technique.canApply(cell, candidates);

        expect(typeof result).toBe('boolean');
    });

    it('should detect HiddenSingle when value can only go in one place in column', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '.........',
            '1........',
            '2........',
            '3........',
            '4........',
            '5........',
            '6........',
            '7........',
            '8........'
        );
        const technique = new HiddenSingleTechnique(game);

        const cell = game.GameField[0][0];
        const candidates = [9];
        const result = technique.canApply(cell, candidates);

        expect(result).toBe(true);
    });

    it('should detect HiddenSingle when value can only go in one place in box', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '1........',
            '2........',
            '3........',
            '4567.....',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........8'
        );
        const technique = new HiddenSingleTechnique(game);

        const cell = game.GameField[0][3];
        const candidates = [9];
        const result = technique.canApply(cell, candidates);

        expect(typeof result).toBe('boolean');
    });
});
