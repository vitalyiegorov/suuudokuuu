import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';
import { Sudoku } from '../sudoku/sudoku';

import { TechniqueManager } from './technique-manager';

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
        expect.assertions(2);

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
        expect(result.isGuessLike).toBe(false);
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

    it('should mark unsupported moves as guess-like', () => {
        expect.assertions(3);

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
        expect(result.isGuessLike).toBe(true);
    });
});
