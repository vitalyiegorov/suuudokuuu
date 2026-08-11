import { describe, expect, it } from '@jest/globals';

import { getFieldCellCandidates } from './get-field-cell-candidates.util';

import type { FieldType } from '../types/field.type';

const boardRows = ['.3.678912', '672195348', '198342567', '859761423', '426853791', '713924856', '961537284', '287419635', '345286179'];

const field: FieldType = boardRows.map((row, y) =>
    Array.from(row).map((character, x) => ({
        x,
        y,
        value: character === '.' ? 0 : Number(character),
        group: Math.floor(y / 3) * 3 + Math.floor(x / 3)
    }))
);

describe('getFieldCellCandidates', () => {
    it('returns the stored notes when auto candidates are disabled', () => {
        const snapshot = { candidates: { '0-0': [2, 9] }, eliminatedCandidates: {}, field, showAutoCandidates: false };

        expect(getFieldCellCandidates(snapshot, field[0][0])).toEqual([2, 9]);
    });

    it('returns an empty array for a cell without notes', () => {
        const snapshot = { candidates: {}, eliminatedCandidates: {}, field, showAutoCandidates: false };

        expect(getFieldCellCandidates(snapshot, field[0][2])).toEqual([]);
    });

    it('ignores stored notes when auto candidates are enabled', () => {
        const snapshot = { candidates: { '0-0': [2, 9] }, eliminatedCandidates: {}, field, showAutoCandidates: true };

        expect(getFieldCellCandidates(snapshot, field[0][0])).toEqual([5]);
    });

    it('removes an engine-eliminated candidate from the computed auto set', () => {
        const snapshot = { candidates: {}, eliminatedCandidates: { '0-0': [5] }, field, showAutoCandidates: true };

        expect(getFieldCellCandidates(snapshot, field[0][0])).toEqual([]);
    });
});
