import { describe, expect, it } from '@jest/globals';

import { getAutoCandidates } from './get-auto-candidates.util';

import type { FieldType } from '../types/field.type';

const boardRows = ['.3.678912', '672195348', '198342567', '859761423', '426853791', '713924856', '961537284', '287419635', '345286179'];

const createField = (rows: string[]): FieldType =>
    rows.map((row, y) =>
        Array.from(row).map((character, x) => ({
            x,
            y,
            value: character === '.' ? 0 : Number(character),
            group: Math.floor(y / 3) * 3 + Math.floor(x / 3)
        }))
    );

describe('getAutoCandidates', () => {
    it('returns no candidates for a filled cell', () => {
        const field = createField(boardRows);

        expect(getAutoCandidates(field, field[1][0])).toEqual([]);
    });

    it('excludes every value present in the row, column and group', () => {
        const field = createField(boardRows);

        expect(getAutoCandidates(field, field[0][0])).toEqual([5]);
        expect(getAutoCandidates(field, field[0][2])).toEqual([4]);
    });
});
