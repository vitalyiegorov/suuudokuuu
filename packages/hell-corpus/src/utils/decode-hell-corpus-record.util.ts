import { GRID_CELL_COUNT, formatGridString } from '@suuudokuuu/solver-core';

import { HELL_CORPUS_CLUE_COUNT } from '../constants/hell-corpus.constant';

const POSITION_MASK_BYTE_COUNT = 11;
const BITS_PER_BYTE = 8;
const NIBBLE_BIT_WIDTH = 4;
const NIBBLE_MASK = 0xf;

const collectGivenCells = (record: Uint8Array): number[] => {
    const givenCells: number[] = [];

    for (let cell = 0; cell < GRID_CELL_COUNT; cell += 1) {
        const positionByte = record[Math.floor(cell / BITS_PER_BYTE)];
        // eslint-disable-next-line no-bitwise -- reads the packed position bit for this cell from the position bitmask bytes
        const isGivenCell = (positionByte & (1 << (cell % BITS_PER_BYTE))) !== 0;

        if (isGivenCell) {
            givenCells.push(cell);
        }
    }

    return givenCells;
};

const readGivenValue = (record: Uint8Array, givenIndex: number): number => {
    const valueByte = record[POSITION_MASK_BYTE_COUNT + Math.floor(givenIndex / 2)];
    const isLowNibble = givenIndex % 2 === 0;

    // eslint-disable-next-line no-bitwise -- given digits are packed two per byte as 4-bit nibbles
    return isLowNibble ? valueByte & NIBBLE_MASK : (valueByte >> NIBBLE_BIT_WIDTH) & NIBBLE_MASK;
};

export const decodeHellCorpusRecord = (record: Uint8Array): string => {
    const grid = new Uint8Array(GRID_CELL_COUNT);
    const givenCells = collectGivenCells(record);

    for (let givenIndex = 0; givenIndex < HELL_CORPUS_CLUE_COUNT; givenIndex += 1) {
        grid[givenCells[givenIndex]] = readGivenValue(record, givenIndex);
    }

    return formatGridString(grid);
};
