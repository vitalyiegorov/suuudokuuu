import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';
import { SerializableSudoku } from '../serializable-sudoku/serializable-sudoku';
import { Sudoku } from '../sudoku/sudoku';

import { TechniqueManager } from './technique-manager';

import type { FieldInterface } from '../../interfaces/field.interface';

describe('TechniqueManager', () => {
    const manager = new TechniqueManager(new Sudoku());

    const createFieldFromString = (fieldString: string): FieldInterface => {
        const [field] = SerializableSudoku.convertFieldFromString(fieldString, defaultSudokuConfig);

        return field;
    };

    it('should identify FullHouse technique for last cell in unit', () => {
        const field = createFieldFromString(
            '12345678.' + '.........' + '.........' + '.........' + '.........' + '.........' + '.........' + '.........' + '.........'
        );

        const cell = field[0][8];
        const technique = manager.identify(field, cell, 9);

        expect(technique).toBe(SolutionTechniqueEnum.FullHouse);
    });

    it('should identify technique for a valid move', () => {
        const field = createFieldFromString(
            '53..7....' + '6..195...' + '.98....6.' + '8...6...3' + '4..8.3..1' + '7...2...6' + '.6....28.' + '...419..5' + '....8..79'
        );

        const cell = field[0][2];
        const technique = manager.identify(field, cell, 4);

        expect(technique).toBeGreaterThanOrEqual(SolutionTechniqueEnum.Guess);
        expect(technique).toBeLessThanOrEqual(SolutionTechniqueEnum.XYZWing);
    });

    it('should identify HiddenSingle when value can only go in one place', () => {
        const field = createFieldFromString(
            '.2345678.' + '1........' + '.........' + '.........' + '.........' + '.........' + '.........' + '.........' + '.........'
        );

        const cell = field[0][8];
        const technique = manager.identify(field, cell, 9);

        expect(technique).toBeGreaterThanOrEqual(SolutionTechniqueEnum.Guess);
        expect(technique).toBeLessThanOrEqual(SolutionTechniqueEnum.XYZWing);
    });

    it('should apply techniques in order of difficulty (easy to hard)', () => {
        const field = createFieldFromString(
            '53..7....' + '6..195...' + '.98....6.' + '8...6...3' + '4..8.3..1' + '7...2...6' + '.6....28.' + '...419..5' + '....8..79'
        );

        const cell = field[0][2];
        const technique = manager.identify(field, cell, 4);

        expect(technique).toBeGreaterThanOrEqual(SolutionTechniqueEnum.Guess);
        expect(technique).toBeLessThanOrEqual(SolutionTechniqueEnum.XYZWing);
    });

    it('should fallback to Guess when no logical technique applies', () => {
        const field = createFieldFromString(
            '.........' + '.........' + '.........' + '.........' + '.........' + '.........' + '.........' + '.........' + '.........'
        );

        const cell = field[0][0];
        const technique = manager.identify(field, cell, 1);

        expect(technique).toBe(SolutionTechniqueEnum.Guess);
    });
});
