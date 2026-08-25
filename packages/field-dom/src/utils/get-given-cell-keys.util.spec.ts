import { describe, expect, it } from '@jest/globals';

import { getGivenCellKeys } from './get-given-cell-keys.util';

const boardRows = ['.3.678912', '672.95348', '1983425.7', '8597.142.', '.268537.1', '7.3924856', '961537284', '287419635', '34.286179'];

const FIELD_CELL_COUNT = 81;
const GIVEN_CELL_COUNT = 71;

describe('getGivenCellKeys', () => {
    it('returns no keys for a fully blank board', () => {
        expect(getGivenCellKeys('.'.repeat(FIELD_CELL_COUNT)).size).toBe(0);
    });

    it('collects every filled cell key', () => {
        const givenCellKeys = getGivenCellKeys(boardRows.join(''));

        expect(givenCellKeys.size).toBe(GIVEN_CELL_COUNT);
        expect(givenCellKeys.has('0-1')).toBe(true);
        expect(givenCellKeys.has('0-0')).toBe(false);
        expect(givenCellKeys.has('8-2')).toBe(false);
        expect(givenCellKeys.has('8-8')).toBe(true);
    });
});
