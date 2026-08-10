import { encodeBase64Bytes } from './base64-encoder.mjs';
import { lineToGrid } from './puzzle-verification.mjs';

const POSITION_MASK_BYTES = 11;
const NIBBLE_MASK = 0xf;
const RATING_SCALE = 10;
const RATING_VALUE_MASK = 0x7f;
const CEILING_FLAG_BIT = 0x80;

export const encodeRatingByte = rating => {
    const scaledRating = Math.round(rating * RATING_SCALE);
    const isCeiling = scaledRating > RATING_VALUE_MASK;
    const clampedValue = isCeiling ? RATING_VALUE_MASK : scaledRating;

    return clampedValue | (isCeiling ? CEILING_FLAG_BIT : 0);
};

const packGivensRecord = (grid, ratingByte, recordBytes) => {
    const record = new Uint8Array(recordBytes);
    const givenCells = [];

    for (let cell = 0; cell < grid.length; cell += 1) {
        if (grid[cell] !== 0) {
            const byteIndex = Math.floor(cell / 8);
            const bitIndex = cell % 8;

            record[byteIndex] |= 1 << bitIndex;
            givenCells.push(cell);
        }
    }

    givenCells.forEach((cell, givenIndex) => {
        const value = grid[cell];
        const byteIndex = POSITION_MASK_BYTES + Math.floor(givenIndex / 2);

        if (givenIndex % 2 === 0) {
            record[byteIndex] |= value & NIBBLE_MASK;
        } else {
            record[byteIndex] |= (value & NIBBLE_MASK) << 4;
        }
    });

    record[recordBytes - 1] = ratingByte;

    return record;
};

export const packPuzzleRecord = (line, ratingByte, recordBytes) =>
    encodeBase64Bytes(packGivensRecord(lineToGrid(line), ratingByte, recordBytes));
