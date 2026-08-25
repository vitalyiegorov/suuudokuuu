import { describe, expect, it } from '@jest/globals';

import { buildFieldPadValues } from './build-field-pad-values.util';

import type { FieldType } from '../types/field.type';

const createField = (rows: string[]): FieldType =>
    rows.map((row, y) =>
        Array.from(row).map((character, x) => ({
            x,
            y,
            value: character === '.' ? 0 : Number(character),
            group: Math.floor(y / 3) * 3 + Math.floor(x / 3)
        }))
    );

const blankField = createField(Array.from({ length: 9 }, () => '.........'));

const almostSolvedField = createField([
    '.3.678912',
    '672195348',
    '198342567',
    '859761423',
    '426853791',
    '713924856',
    '961537284',
    '287419635',
    '345286179'
]);

describe('buildFieldPadValues', () => {
    it('reports every value as fully remaining on a blank field', () => {
        const padValues = buildFieldPadValues(blankField);

        expect(padValues).toHaveLength(9);
        expect(padValues[0]).toEqual({ value: 1, remaining: 9, isComplete: false });
        expect(padValues[8]).toEqual({ value: 9, remaining: 9, isComplete: false });
    });

    it('counts placed values and marks completed values', () => {
        const padValues = buildFieldPadValues(almostSolvedField);

        expect(padValues[3]).toEqual({ value: 4, remaining: 1, isComplete: false });
        expect(padValues[4]).toEqual({ value: 5, remaining: 1, isComplete: false });
        expect(padValues[0]).toEqual({ value: 1, remaining: 0, isComplete: true });
    });
});
