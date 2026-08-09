import { isNumber } from '@rnw-community/shared';

import type { DecodedCorpusRecordInterface } from '../interfaces/decoded-corpus-record.interface';
import type { InfinityPuzzleInterface } from '../interfaces/infinity-puzzle.interface';

export const ensureInfinityPuzzleRating = (record: DecodedCorpusRecordInterface, index: number): InfinityPuzzleInterface => {
    const { puzzle, rating } = record;

    if (!isNumber(rating)) {
        throw new Error(`Infinity corpus record at index ${index} is missing its curated rating`);
    }

    return { puzzle, rating };
};
