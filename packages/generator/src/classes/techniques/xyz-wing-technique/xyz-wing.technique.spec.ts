import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { SerializableSudoku } from '../../serializable-sudoku/serializable-sudoku';
import { Sudoku } from '../../sudoku/sudoku';

import { XYZWingTechnique } from './xyz-wing.technique';

import type { FieldInterface } from '../../../interfaces/field.interface';

describe('XYZWingTechnique', () => {
    const sudoku = new Sudoku();
    const technique = new XYZWingTechnique(sudoku);

    const createFieldFromString = (fieldString: string): FieldInterface => {
        const [field] = SerializableSudoku.convertFieldFromString(fieldString, defaultSudokuConfig);

        return field;
    };

    it('should have correct type and difficulty', () => {
        expect(technique.type).toBe(SolutionTechniqueEnum.XYZWing);
        expect(technique.difficulty).toBe(16);
    });

    it('should find all XYZ-Wing patterns in field', () => {
        const field = createFieldFromString(
            '..3..6..8' +
            '..5..8..3' +
            '..1..3..5' +
            '3........' +
            '5........' +
            '1........' +
            '.........' +
            '.........' +
            '.........',
        );

        const results = technique.findAll(field);

        expect(Array.isArray(results)).toBe(true);
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

    it('should return empty array for nearly empty field', () => {
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

        expect(results.length).toBe(0);
    });
});
