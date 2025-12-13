import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { SerializableSudoku } from '../../serializable-sudoku/serializable-sudoku';

import { HiddenSingleTechnique } from './hidden-single.technique';

import type { FieldInterface } from '../../../interfaces/field.interface';

describe('HiddenSingleTechnique', () => {
    const technique = new HiddenSingleTechnique();

    const createFieldFromString = (fieldString: string): FieldInterface => {
        const [field] = SerializableSudoku.convertFieldFromString(fieldString, defaultSudokuConfig);

        return field;
    };

    it('should have correct type and difficulty', () => {
        expect(technique.type).toBe(SolutionTechniqueEnum.HiddenSingle);
        expect(technique.difficulty).toBe(3);
    });

    it('should detect HiddenSingle when value can only go in one place in row', () => {
        const field = createFieldFromString('.2345678.1.......................................................................');

        const cell = field[0][8];
        const candidates = [9];
        const result = technique.canApply(field, cell, candidates);

        expect(typeof result).toBe('boolean');
    });

    it('should detect HiddenSingle when value can only go in one place in column', () => {
        const field = createFieldFromString('.........1........2........3........4........5........6........7........8........');

        const cell = field[0][0];
        const candidates = [9];
        const result = technique.canApply(field, cell, candidates);

        expect(result).toBe(true);
    });

    it('should detect HiddenSingle when value can only go in one place in box', () => {
        const field = createFieldFromString('1........2........3........4567.................................................8');

        const cell = field[0][3];
        const candidates = [9];
        const result = technique.canApply(field, cell, candidates);

        expect(typeof result).toBe('boolean');
    });
});
