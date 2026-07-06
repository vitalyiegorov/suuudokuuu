import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { TechniqueManager } from './technique-manager';

import type { TechniqueStrategyInterface } from '../../interfaces/technique-strategy.interface';

const createEmptyStrategy = (): TechniqueStrategyInterface => ({
    find: () => [],
    technique: SolutionTechniqueEnum.FullHouse
});

describe('TechniqueManager', () => {
    it('should find the easiest next logical step', () => {
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
        const manager = new TechniqueManager(sudoku);

        expect(manager.findNextStep()).toEqual(
            expect.objectContaining({ technique: SolutionTechniqueEnum.FullHouse, cell: sudoku.Field[0][8], value: 9 })
        );
    });

    it('should identify an exact player move', () => {
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
        const manager = new TechniqueManager(sudoku);
        const result = manager.identifyMove({ ...sudoku.Field[0][8], value: 9 });

        expect(result.technique).toBe(SolutionTechniqueEnum.FullHouse);
    });

    it('should keep identify compatibility helper', () => {
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
        const manager = new TechniqueManager(sudoku);

        expect(manager.identify(sudoku.Field[0][8])).toBe(SolutionTechniqueEnum.FullHouse);
    });

    it('should prefer the simplest technique when several apply', () => {
        expect.assertions(2);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '12345678.',
            '.........',
            '.........',
            '.....7...',
            '2143.....',
            '...8.....',
            '.........',
            '....6....',
            '.........'
        );
        const manager = new TechniqueManager(sudoku);

        expect(manager.findNextStep()).toEqual(
            expect.objectContaining({ technique: SolutionTechniqueEnum.FullHouse, cell: sudoku.Field[0][8], value: 9 })
        );
        expect(manager.identifyMove({ ...sudoku.Field[4][4], value: 9 }).technique).toBe(SolutionTechniqueEnum.NakedSingle);
    });

    it('should mark unsupported moves as guesses', () => {
        expect.assertions(2);

        const sudoku = Sudoku.fromStrings(
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
        const manager = new TechniqueManager(sudoku);
        const [[cell]] = sudoku.Field;
        const result = manager.identifyMove({ ...cell, value: sudoku.getCorrectValue(cell) });

        expect(result.technique).toBe(SolutionTechniqueEnum.Guess);
        expect(result.kind).toBe('guess');
    });

    it('should use a guess when no strategy finds a logical step', () => {
        expect.assertions(2);

        const sudoku = Sudoku.fromStrings(
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
        const manager = new TechniqueManager(sudoku, [createEmptyStrategy()]);
        const result = manager.findNextStep();

        expect(result).toEqual(expect.objectContaining({ technique: SolutionTechniqueEnum.Guess }));
        expect(result?.kind).toBe('guess');
    });

    it('should return null when the puzzle has no blank cells', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '123456789',
            '456789123',
            '789123456',
            '214365897',
            '365897214',
            '897214365',
            '531642978',
            '642978531',
            '978531642'
        );
        const manager = new TechniqueManager(sudoku, [createEmptyStrategy()]);

        expect(manager.findNextStep()).toBeNull();
    });
});
