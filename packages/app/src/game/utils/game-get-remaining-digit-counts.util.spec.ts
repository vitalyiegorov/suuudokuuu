import { describe, expect, it } from '@jest/globals';

import { gameGetRemainingDigitCounts } from './game-get-remaining-digit-counts.util';

import type { FieldInterface } from '@suuudokuuu/generator';

const FieldSize = 9;

const solvedFieldString = [
    '534678912',
    '672195348',
    '198342567',
    '859761423',
    '426853791',
    '713924856',
    '961537284',
    '287419635',
    '345286179'
].join('');
const emptyFieldString = '0'.repeat(FieldSize * FieldSize);
const singleRowFieldString = solvedFieldString.slice(0, FieldSize) + emptyFieldString.slice(FieldSize);

const buildField = (fieldString: string): FieldInterface =>
    Array.from({ length: FieldSize }, (_unusedRow, y) =>
        Array.from({ length: FieldSize }, (_unusedCell, x) => ({ x, y, group: 0, value: Number(fieldString[y * FieldSize + x]) }))
    );

describe('gameGetRemainingDigitCounts', () => {
    it('should report nine of every digit left on a blank board', () => {
        expect.assertions(1);

        expect([...gameGetRemainingDigitCounts(buildField(emptyFieldString)).values()]).toStrictEqual([9, 9, 9, 9, 9, 9, 9, 9, 9]);
    });

    it('should report nothing left of any digit on a solved board', () => {
        expect.assertions(1);

        expect([...gameGetRemainingDigitCounts(buildField(solvedFieldString)).values()]).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it('should subtract every placed occurrence of a digit', () => {
        expect.assertions(2);

        const counts = gameGetRemainingDigitCounts(buildField(singleRowFieldString));

        expect(counts.get(5)).toBe(8);
        expect(counts.get(3)).toBe(8);
    });

    it('should key the map by every numpad digit and ignore the blank value', () => {
        expect.assertions(1);

        expect([...gameGetRemainingDigitCounts(buildField(emptyFieldString)).keys()]).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
});
