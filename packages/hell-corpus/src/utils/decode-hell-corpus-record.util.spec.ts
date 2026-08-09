import { describe, expect, it } from '@jest/globals';
import { GRID_CELL_COUNT } from '@suuudokuuu/solver-core';

import { HELL_CORPUS_CLUE_COUNT, HELL_CORPUS_RECORD_BYTES } from '../constants/hell-corpus.constant';

import { decodeHellCorpusRecord } from './decode-hell-corpus-record.util';

const ROYLE_17 = '000000010400000000020000000000050407008000300001090000300400200050100000000806000';

const POSITION_MASK_BYTE_COUNT = 11;
const BITS_PER_BYTE = 8;
const NIBBLE_BIT_WIDTH = 4;
const NIBBLE_MASK = 0xf;
const GIVEN_CELL_STRIDE = 5;
const RATING_ELEVEN_POINT_NINE_BYTE = 119;
const RATING_ELEVEN_POINT_NINE = 11.9;

const buildSpreadGivensPuzzle = (): string => {
    const cells = Array.from({ length: HELL_CORPUS_CLUE_COUNT }, (_, given) => given * GIVEN_CELL_STRIDE);
    const grid = new Array<string>(GRID_CELL_COUNT).fill('0');

    cells.forEach((cell, given) => {
        grid[cell] = String((given % 9) + 1);
    });

    return grid.join('');
};

const packPuzzleForTest = (puzzle: string): Uint8Array => {
    const record = new Uint8Array(HELL_CORPUS_RECORD_BYTES);
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

    return record;
};

describe('decodeHellCorpusRecord', () => {
    it('round-trips a known 17-clue puzzle', () => {
        expect(decodeHellCorpusRecord(packPuzzleForTest(ROYLE_17), HELL_CORPUS_RECORD_BYTES).puzzle).toBe(ROYLE_17);
    });

    it('round-trips a synthetic puzzle covering both grid boundaries and every digit', () => {
        const puzzle = buildSpreadGivensPuzzle();

        expect(decodeHellCorpusRecord(packPuzzleForTest(puzzle), HELL_CORPUS_RECORD_BYTES).puzzle).toBe(puzzle);
    });

    it('decodes an unset rating byte as null', () => {
        expect(decodeHellCorpusRecord(packPuzzleForTest(ROYLE_17), HELL_CORPUS_RECORD_BYTES).rating).toBeNull();
    });

    it('decodes a curated rating byte', () => {
        const record = packPuzzleForTest(ROYLE_17);

        record[record.length - 1] = RATING_ELEVEN_POINT_NINE_BYTE;

        expect(decodeHellCorpusRecord(record, HELL_CORPUS_RECORD_BYTES).rating).toBe(RATING_ELEVEN_POINT_NINE);
    });
});
