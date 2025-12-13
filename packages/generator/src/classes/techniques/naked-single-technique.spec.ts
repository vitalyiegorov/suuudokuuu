import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';
import { SerializableSudoku } from '../serializable-sudoku/serializable-sudoku';

import { NakedSingleTechnique } from './naked-single-technique';

import type { FieldInterface } from '../../interfaces/field.interface';

describe('NakedSingleTechnique', () => {
    const technique = new NakedSingleTechnique();

    const createFieldFromString = (fieldString: string): FieldInterface => {
        const [field] = SerializableSudoku.convertFieldFromString(fieldString, defaultSudokuConfig);

        return field;
    };

    it('should have correct type and difficulty', () => {
        expect(technique.type).toBe(SolutionTechniqueEnum.NakedSingle);
        expect(technique.difficulty).toBe(2);
    });

    it('should detect NakedSingle when cell has only one candidate', () => {
        const field = createFieldFromString(
            '53..7....' +
                '6..195...' +
                '.98....6.' +
                '8...6...3' +
                '4..8.3..1' +
                '7...2...6' +
                '.6....28.' +
                '...419..5' +
                '....8..79'
        );

        const cell = field[0][2];
        const candidates = [4];
        const result = technique.canApply(field, cell, 4, candidates);

        expect(result).toBe(true);
    });

    it('should not detect NakedSingle when cell has multiple candidates', () => {
        const field = createFieldFromString(
            '53..7....' +
                '6..195...' +
                '.98....6.' +
                '8...6...3' +
                '4..8.3..1' +
                '7...2...6' +
                '.6....28.' +
                '...419..5' +
                '....8..79'
        );

        const cell = field[0][3];
        const candidates = [2, 6];
        const result = technique.canApply(field, cell, 2, candidates);

        expect(result).toBe(false);
    });

    it('should find all NakedSingle opportunities in field', () => {
        const field = createFieldFromString(
            '53..7....' +
                '6..195...' +
                '.98....6.' +
                '8...6...3' +
                '4..8.3..1' +
                '7...2...6' +
                '.6....28.' +
                '...419..5' +
                '....8..79'
        );

        const results = technique.findAll(field);
        const nakedSingleResults = results.filter((result) => result.technique === SolutionTechniqueEnum.NakedSingle);

        expect(nakedSingleResults.length).toBeGreaterThan(0);
    });
});
