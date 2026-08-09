import { describe, expect, it } from '@jest/globals';

import { getCorpusRecord } from './get-corpus-record.util';

const POSITION_MASK_BYTE_COUNT = 11;
const BITS_PER_BYTE = 8;
const NIBBLE_BIT_WIDTH = 4;
const NIBBLE_MASK = 0xf;
const SIX_BIT_MASK = 0x3f;
const RECORD_BYTES = 22;
const RECORD_BASE64_LENGTH = 32;
const NEGATIVE_INDEX = -1;
const NON_INTEGER_INDEX = 1.5;
const RATING_TEN_POINT_SIX_BYTE = 106;
const RATING_TEN_POINT_SIX = 10.6;
const UNRATED_BYTE = 0;

const ROYLE_17 = '000000010400000000020000000000050407008000300001090000300400200050100000000806000';
const RED_DWARF_TEST_PUZZLE = '120340005001040000000005000000000000000000000000000000000000000000000000000000000';

const packRecord = (puzzle: string, ratingByte: number): Uint8Array => {
    const record = new Uint8Array(RECORD_BYTES);
    const givenCells: number[] = [];

    for (let cell = 0; cell < puzzle.length; cell += 1) {
        if (puzzle[cell] !== '0') {
            // eslint-disable-next-line no-bitwise -- test oracle mirrors the position bitmask packing being verified
            record[Math.floor(cell / BITS_PER_BYTE)] |= 1 << (cell % BITS_PER_BYTE);
            givenCells.push(cell);
        }
    }

    givenCells.forEach((cell, givenIndex) => {
        const value = Number(puzzle[cell]);
        const byteIndex = POSITION_MASK_BYTE_COUNT + Math.floor(givenIndex / 2);

        // eslint-disable-next-line no-bitwise -- test oracle mirrors the nibble packing being verified
        record[byteIndex] |= givenIndex % 2 === 0 ? value & NIBBLE_MASK : (value & NIBBLE_MASK) << NIBBLE_BIT_WIDTH;
    });

    record[RECORD_BYTES - 1] = ratingByte;

    return record;
};

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const encodeRecordBase64 = (record: Uint8Array): string => {
    let result = '';

    for (let offset = 0; offset < record.length; offset += 3) {
        const byte0 = record[offset];
        const byte1 = record[offset + 1] ?? 0;
        const byte2 = record[offset + 2] ?? 0;

        // eslint-disable-next-line no-bitwise -- test oracle mirrors the base64 packing being verified
        result += BASE64_ALPHABET[byte0 >> 2];
        // eslint-disable-next-line no-bitwise -- test oracle mirrors the base64 packing being verified
        result += BASE64_ALPHABET[((byte0 & 0x3) << 4) | (byte1 >> 4)];
        // eslint-disable-next-line no-bitwise -- test oracle mirrors the base64 packing being verified
        result += BASE64_ALPHABET[((byte1 & NIBBLE_MASK) << 2) | (byte2 >> 6)];
        // eslint-disable-next-line no-bitwise -- test oracle mirrors the base64 packing being verified
        result += BASE64_ALPHABET[byte2 & SIX_BIT_MASK];
    }

    return result;
};

const CORPUS_BASE64 = [packRecord(ROYLE_17, UNRATED_BYTE), packRecord(RED_DWARF_TEST_PUZZLE, RATING_TEN_POINT_SIX_BYTE)]
    .map(encodeRecordBase64)
    .join('');
const CORPUS_SIZE = 2;

const LOOKUP = {
    corpusBase64: CORPUS_BASE64,
    corpusSize: CORPUS_SIZE,
    recordBase64Length: RECORD_BASE64_LENGTH,
    recordBytes: RECORD_BYTES
};

describe('getCorpusRecord', () => {
    it('decodes the puzzle and rating for a record at a given index', () => {
        const record = getCorpusRecord(LOOKUP, 0);

        expect(record.puzzle).toBe(ROYLE_17);
        expect(record.rating).toBeNull();
    });

    it('decodes a later record using its own slice of the corpus string', () => {
        const record = getCorpusRecord(LOOKUP, 1);

        expect(record.puzzle).toBe(RED_DWARF_TEST_PUZZLE);
        expect(record.rating).toBe(RATING_TEN_POINT_SIX);
    });

    it('throws for a negative index', () => {
        expect(() => getCorpusRecord(LOOKUP, NEGATIVE_INDEX)).toThrow();
    });

    it('throws for an index at the size boundary', () => {
        expect(() => getCorpusRecord(LOOKUP, CORPUS_SIZE)).toThrow();
    });

    it('throws for a non-integer index', () => {
        expect(() => getCorpusRecord(LOOKUP, NON_INTEGER_INDEX)).toThrow();
    });
});
