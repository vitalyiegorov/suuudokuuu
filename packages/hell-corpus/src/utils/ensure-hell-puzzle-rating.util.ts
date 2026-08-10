import { isNumber } from '@rnw-community/shared';

import type { DecodedCorpusRecordInterface } from '../interfaces/decoded-corpus-record.interface';
import type { HellPuzzleInterface } from '../interfaces/hell-puzzle.interface';

export const ensureHellPuzzleRating = (record: DecodedCorpusRecordInterface, index: number): HellPuzzleInterface => {
    const { puzzle, rating } = record;

    if (!isNumber(rating)) {
        throw new Error(`Hell corpus record at index ${index} is missing its stored rating`);
    }

    return { puzzle, rating };
};
