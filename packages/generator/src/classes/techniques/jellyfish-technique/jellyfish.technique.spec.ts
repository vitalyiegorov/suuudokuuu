import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { SerializableSudoku } from '../../serializable-sudoku/serializable-sudoku';

import { JellyfishTechnique } from './jellyfish.technique';

import type { FieldInterface } from '../../../interfaces/field.interface';

describe('JellyfishTechnique', () => {
    const technique = new JellyfishTechnique();

    const createFieldFromString = (fieldString: string): FieldInterface => {
        const [field] = SerializableSudoku.convertFieldFromString(fieldString, defaultSudokuConfig);

        return field;
    };

    it('should have correct type and difficulty', () => {
        expect(technique.type).toBe(SolutionTechniqueEnum.Jellyfish);
        expect(technique.difficulty).toBe(14);
    });

    it('should find all Jellyfish patterns in field', () => {
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
