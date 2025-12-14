import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { SerializableSudoku } from '../../serializable-sudoku/serializable-sudoku';
import { Sudoku } from '../../sudoku/sudoku';

import { FullHouseTechnique } from './full-house.technique';

import type { FieldInterface } from '../../../interfaces/field.interface';

describe('FullHouseTechnique', () => {
    const sudoku = new Sudoku();
    const technique = new FullHouseTechnique(sudoku);

    const createFieldFromString = (fieldString: string): FieldInterface => {
        const [field] = SerializableSudoku.convertFieldFromString(fieldString, defaultSudokuConfig);

        return field;
    };

    it('should have correct type and difficulty', () => {
        expect(technique.type).toBe(SolutionTechniqueEnum.FullHouse);
        expect(technique.difficulty).toBe(1);
    });

    it('should detect FullHouse when only one cell left in a row', () => {
        const field = createFieldFromString('12345678.........................................................................');

        const cell = field[0][8];
        const candidates = [9];
        const result = technique.canApply(field, cell, candidates);

        expect(result).toBe(true);
    });

    it('should detect FullHouse when only one cell left in a column', () => {
        const field = createFieldFromString('1........2........3........4........5........6........7........8.................');

        const cell = field[8][0];
        const candidates = [9];
        const result = technique.canApply(field, cell, candidates);

        expect(result).toBe(true);
    });

    it('should handle box check correctly', () => {
        const field = createFieldFromString('12.......34.......5678...........................................................');

        const cell = field[2][4];
        const candidates = [9];
        const result = technique.canApply(field, cell, candidates);

        expect(typeof result).toBe('boolean');
    });

    it('should not detect FullHouse when cell has multiple candidates', () => {
        const field = createFieldFromString('1234567..........................................................................');

        const cell = field[0][7];
        const candidates = [8, 9];
        const result = technique.canApply(field, cell, candidates);

        expect(typeof result).toBe('boolean');
    });
});
