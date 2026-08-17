import { isDefined } from '@rnw-community/shared';

import {
    TECHNIQUE_CODE_BITS,
    TECHNIQUE_CODE_MAX,
    TECHNIQUE_CODE_UNKNOWN,
    TECHNIQUE_TRAILER_VERSION_BITS,
    TECHNIQUE_TRAILER_VERSION_V1
} from '../constants/binary-codec.constant';

import type { DecodedGameStateInterface } from '../interfaces/decoded-game-state.interface';
import type { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

export type TechniqueTrailerInterface = Pick<DecodedGameStateInterface, 'techniques'>;

const emptyTechniqueTrailer: TechniqueTrailerInterface = { techniques: null };

export const getTechniqueTrailerBits = (cellEventCount: number): number =>
    TECHNIQUE_TRAILER_VERSION_BITS + cellEventCount * TECHNIQUE_CODE_BITS;

const toTechniqueCode = (technique: number | null | undefined): number =>
    isDefined(technique) ? Math.min(Math.max(Math.trunc(technique), 0), TECHNIQUE_CODE_MAX) : TECHNIQUE_CODE_UNKNOWN;

const fromTechniqueCode = (code: number): number | null => (code === TECHNIQUE_CODE_UNKNOWN ? null : code);

export const writeTechniqueTrailer = (out: BitOutputStream, techniques: (number | null)[], cellEventCount: number): void => {
    out.write(TECHNIQUE_TRAILER_VERSION_V1, TECHNIQUE_TRAILER_VERSION_BITS);

    for (let cellEventIndex = 0; cellEventIndex < cellEventCount; cellEventIndex += 1) {
        out.write(toTechniqueCode(techniques[cellEventIndex]), TECHNIQUE_CODE_BITS);
    }
};

export const readTechniqueTrailer = (input: BitInputStream, cellEventCount: number): TechniqueTrailerInterface => {
    const positionBeforeTrailer = input.position;

    if (cellEventCount === 0 || input.length - positionBeforeTrailer < getTechniqueTrailerBits(cellEventCount)) {
        return emptyTechniqueTrailer;
    }

    if (input.read(TECHNIQUE_TRAILER_VERSION_BITS) !== TECHNIQUE_TRAILER_VERSION_V1) {
        input.seek(positionBeforeTrailer);

        return emptyTechniqueTrailer;
    }

    return { techniques: Array.from({ length: cellEventCount }, () => fromTechniqueCode(input.read(TECHNIQUE_CODE_BITS))) };
};
