import { isNumber } from '@rnw-community/shared';

import type { DecodedCorpusRecordInterface } from '../interfaces/decoded-corpus-record.interface';
import type { RatedCorpusPuzzleInterface } from '../interfaces/rated-corpus-puzzle.interface';

export const ensureRatedCorpusPuzzle = (
    record: DecodedCorpusRecordInterface,
    index: number,
    createMissingRatingMessage: (index: number) => string
): RatedCorpusPuzzleInterface => {
    const { puzzle, rating, isCeiling } = record;

    if (!isNumber(rating)) {
        throw new Error(createMissingRatingMessage(index));
    }

    return { puzzle, rating, isCeiling };
};
