import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { SerializableSudoku } from '../../serializable-sudoku/serializable-sudoku';
import { Sudoku } from '../../sudoku/sudoku';

import { GuessTechnique } from './guess-technique';

import type { FieldInterface } from '../../../interfaces/field.interface';

describe('GuessTechnique', () => {
    const sudoku = new Sudoku();
    const technique = new GuessTechnique(sudoku);

    const createFieldFromString = (fieldString: string): FieldInterface => {
        const [field] = SerializableSudoku.convertFieldFromString(fieldString, defaultSudokuConfig);

        return field;
    };

    it('should have correct type and difficulty', () => {
        expect(technique.type).toBe(SolutionTechniqueEnum.Guess);
        expect(technique.difficulty).toBe(100);
    });

    it('should always return true for canApply on empty cells', () => {
        const field = createFieldFromString(
            '1........' +
            '.........' +
            '.........' +
            '.........' +
            '.........' +
            '.........' +
            '.........' +
            '.........' +
            '.........',
        );

        const cell = field[0][1];
        const candidates = [2, 3, 4, 5, 6, 7, 8, 9];
        const result = technique.canApply(field, cell, candidates);

        expect(result).toBe(true);
    });

    it('should return false for filled cells', () => {
        const field = createFieldFromString(
            '123456789' +
            '456789123' +
            '789123456' +
            '234567891' +
            '567891234' +
            '891234567' +
            '345678912' +
            '678912345' +
            '912345678',
        );

        const cell = field[0][0];
        const candidates: number[] = [];
        const result = technique.canApply(field, cell, candidates);

        expect(result).toBe(false);
    });

    it('should find all empty cells as possible guesses', () => {
        const field = createFieldFromString(
            '1........' +
            '.........' +
            '.........' +
            '.........' +
            '.........' +
            '.........' +
            '.........' +
            '.........' +
            '.........',
        );

        const results = technique.findAll(field);

        expect(results.length).toBeGreaterThan(0);
        expect(results.length).toBeLessThanOrEqual(80);
    });

    it('should return empty array for solved field', () => {
        const field = createFieldFromString(
            '123456789' +
            '456789123' +
            '789123456' +
            '234567891' +
            '567891234' +
            '891234567' +
            '345678912' +
            '678912345' +
            '912345678',
        );

        const results = technique.findAll(field);

        expect(results.length).toBe(0);
    });
});
