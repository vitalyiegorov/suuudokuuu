import {
    ANCHOR_SECONDS_BITS,
    CANDIDATE_COUNT_BITS,
    CANDIDATE_MASK_BITS,
    CELL_INDEX_BITS_ABSOLUTE,
    SCORE_LARGE_BITS,
    SCORE_SMALL_BITS
} from '../constants/binary-codec.constant';
import { GRID_SIZE } from '../constants/grid.constant';

import { readVarint, writeVarint } from './varint.util';

import type { DecodedGameStateInterface } from '../interfaces/decoded-game-state.interface';
import type { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

export type HandoffExtrasInterface = Pick<DecodedGameStateInterface, 'anchorSeconds' | 'candidates' | 'score'>;

const CANDIDATE_BIT_BASE = 2;

const getCellKey = (cellIndex: number): string => `${cellIndex % GRID_SIZE},${Math.floor(cellIndex / GRID_SIZE)}`;

const getCellIndexFromKey = (key: string): number => {
    const [x, y] = key.split(',').map(part => parseInt(part, 10));

    return y * GRID_SIZE + x;
};

const getCandidateMask = (values: number[]): number => values.reduce((mask, value) => mask + CANDIDATE_BIT_BASE ** (value - 1), 0);

const getCandidateValues = (mask: number): number[] => {
    const values: number[] = [];

    for (let value = 1; value <= GRID_SIZE; value += 1) {
        const isSet = Math.floor(mask / CANDIDATE_BIT_BASE ** (value - 1)) % CANDIDATE_BIT_BASE === 1;

        if (isSet) {
            values.push(value);
        }
    }

    return values;
};

export const writeHandoffExtras = (out: BitOutputStream, extras: HandoffExtrasInterface, isChallengeRun: boolean): void => {
    writeVarint(out, extras.score, SCORE_SMALL_BITS, SCORE_LARGE_BITS);

    const filledEntries = Object.entries(extras.candidates).filter(([, values]) => values.length > 0);

    out.write(filledEntries.length, CANDIDATE_COUNT_BITS);

    for (const [key, values] of filledEntries) {
        out.write(getCellIndexFromKey(key), CELL_INDEX_BITS_ABSOLUTE);
        out.write(getCandidateMask(values), CANDIDATE_MASK_BITS);
    }

    if (isChallengeRun) {
        out.write(Math.max(Math.trunc(extras.anchorSeconds), 0), ANCHOR_SECONDS_BITS);
    }
};

export const readHandoffExtras = (input: BitInputStream, isChallengeRun: boolean): HandoffExtrasInterface => {
    const score = readVarint(input, SCORE_SMALL_BITS, SCORE_LARGE_BITS);
    const candidateCount = input.read(CANDIDATE_COUNT_BITS);
    const candidates: Record<string, number[]> = {};

    for (let entryIndex = 0; entryIndex < candidateCount; entryIndex += 1) {
        const cellIndex = input.read(CELL_INDEX_BITS_ABSOLUTE);

        candidates[getCellKey(cellIndex)] = getCandidateValues(input.read(CANDIDATE_MASK_BITS));
    }

    const anchorSeconds = isChallengeRun ? input.read(ANCHOR_SECONDS_BITS) : 0;

    return { anchorSeconds, candidates, score };
};

export const emptyHandoffExtras: HandoffExtrasInterface = { anchorSeconds: 0, candidates: {}, score: 0 };
