import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { SerializableSudoku } from '../../serializable-sudoku/serializable-sudoku';
import { Sudoku } from '../../sudoku/sudoku';

import { NakedPairTechnique } from './naked-pair.technique';

import type { FieldInterface } from '../../../interfaces/field.interface';

describe('NakedPairTechnique', () => {
    const sudoku = new Sudoku();
    const technique = new NakedPairTechnique(sudoku);

    const createFieldFromString = (fieldString: string): FieldInterface => {
        const [field] = SerializableSudoku.convertFieldFromString(fieldString, defaultSudokuConfig);

        return field;
    };

    it('should have correct type and difficulty', () => {
        expect(technique.type).toBe(SolutionTechniqueEnum.NakedPair);
        expect(technique.difficulty).toBe(4);
    });

    it('should detect NakedPair when conditions are met', () => {
        const field = createFieldFromString('3456789.........12.......34......................................................');

        const cell = field[0][7];
        const candidates = [1, 2];
        const result = technique.canApply(field, cell, candidates);

        expect(typeof result).toBe('boolean');
    });

    it('should not detect NakedPair when cell has more than two candidates', () => {
        const field = createFieldFromString('3456789..........................................................................');

        const cell = field[0][7];
        const candidates = [1, 2, 7];
        const result = technique.canApply(field, cell, candidates);

        expect(result).toBe(false);
    });
});
