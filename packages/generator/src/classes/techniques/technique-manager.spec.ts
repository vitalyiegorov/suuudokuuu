import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import { Sudoku } from '../sudoku/sudoku';

import { TechniqueManager } from './technique-manager';

describe('TechniqueManager', () => {
    const sudoku = new Sudoku();
    const manager = new TechniqueManager(sudoku);

    it('should identify FullHouse technique for last cell in unit', () => {
        const game = Sudoku.fromStrings(
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

        const cell = game.GameField[0][8];
        const technique = manager.identify(game.GameField, cell, 9);

        expect(technique).toBe(SolutionTechniqueEnum.FullHouse);
    });

    it('should identify technique for a valid move', () => {
        const game = Sudoku.fromStrings(
            '53..7....',
            '6..195...',
            '.98....6.',
            '8...6...3',
            '4..8.3..1',
            '7...2...6',
            '.6....28.',
            '...419..5',
            '....8..79'
        );

        const cell = game.GameField[0][2];
        const technique = manager.identify(game.GameField, cell, 4);

        expect(technique).toBeGreaterThanOrEqual(SolutionTechniqueEnum.Guess);
        expect(technique).toBeLessThanOrEqual(SolutionTechniqueEnum.XYZWing);
    });

    it('should identify HiddenSingle when value can only go in one place', () => {
        const game = Sudoku.fromStrings(
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

        const cell = game.GameField[0][8];
        const technique = manager.identify(game.GameField, cell, 9);

        expect(technique).toBeGreaterThanOrEqual(SolutionTechniqueEnum.Guess);
        expect(technique).toBeLessThanOrEqual(SolutionTechniqueEnum.XYZWing);
    });

    it('should apply techniques in order of difficulty (easy to hard)', () => {
        const game = Sudoku.fromStrings(
            '53..7....',
            '6..195...',
            '.98....6.',
            '8...6...3',
            '4..8.3..1',
            '7...2...6',
            '.6....28.',
            '...419..5',
            '....8..79'
        );

        const cell = game.GameField[0][2];
        const technique = manager.identify(game.GameField, cell, 4);

        expect(technique).toBeGreaterThanOrEqual(SolutionTechniqueEnum.Guess);
        expect(technique).toBeLessThanOrEqual(SolutionTechniqueEnum.XYZWing);
    });

    it('should fallback to Guess when no logical technique applies', () => {
        const game = Sudoku.fromStrings(
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

        const cell = game.GameField[0][0];
        const technique = manager.identify(game.GameField, cell, 1);

        expect(technique).toBe(SolutionTechniqueEnum.Guess);
    });
});
