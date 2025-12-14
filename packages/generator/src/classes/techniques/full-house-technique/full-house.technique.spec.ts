import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { Sudoku } from '../../sudoku/sudoku';

import { FullHouseTechnique } from './full-house.technique';

describe('FullHouseTechnique', () => {
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
        const technique = new FullHouseTechnique(game);

        expect(technique.type).toBe(SolutionTechniqueEnum.FullHouse);
        expect(technique.difficulty).toBe(1);
    });

    it('should return correct solution when only one cell left in a row', () => {
        const game = Sudoku.fromStrings(
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
        const technique = new FullHouseTechnique(game);

        const cell = game.Field[0][8];
        const result = technique.getSolution(cell);

        expect(result).toBe(9);
    });

    it('should return correct solution when only one cell left in a column', () => {
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
        const technique = new FullHouseTechnique(game);

        const cell = game.Field[0][0];
        const result = technique.getSolution(cell);

        expect(result).toBe(9);
    });

    it('should return correct solution when only one cell left in a box', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '12.......',
            '348......',
            '567......',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const technique = new FullHouseTechnique(game);

        const cell = game.Field[0][2];
        const result = technique.getSolution(cell);

        expect(result).toBe(9);
    });

    it('should return null when cell has multiple candidates', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '1234567..',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const technique = new FullHouseTechnique(game);

        const cell = game.Field[0][7];
        const result = technique.getSolution(cell);

        expect(result).toBe(null);
    });

    it('should return null when cell is already filled', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
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
        const technique = new FullHouseTechnique(game);

        const cell = game.Field[0][0];
        const result = technique.getSolution(cell);

        expect(result).toBe(null);
    });
});
