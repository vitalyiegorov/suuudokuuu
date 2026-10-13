import { isNumber } from '@rnw-community/shared';

import { decodeBase64Bytes } from './decode-base64-bytes.util';
import { decodeHellCorpusRecord } from './decode-hell-corpus-record.util';

import type { CorpusRecordLookupInterface } from '../interfaces/corpus-record-lookup.interface';
import type { RatedCorpusPuzzleInterface } from '../interfaces/rated-corpus-puzzle.interface';

export const getCorpusRecord = (lookup: CorpusRecordLookupInterface, index: number): RatedCorpusPuzzleInterface => {
    const { corpusBase64, corpusSize, recordBase64Length, recordBytes } = lookup;
    const isValidIndex = Number.isInteger(index) && index >= 0 && index < corpusSize;
    if (!isValidIndex) {
        throw new Error(`Corpus index must be an integer between 0 and ${corpusSize - 1}, received ${index}`);
    }

    const recordStart = index * recordBase64Length;
    const recordBase64 = corpusBase64.slice(recordStart, recordStart + recordBase64Length);

    const { puzzle, rating, isCeiling } = decodeHellCorpusRecord(decodeBase64Bytes(recordBase64), recordBytes);

    if (!isNumber(rating)) {
        throw new Error(`Corpus record at index ${index} is missing its rating`);
    }

    return { puzzle, rating, isCeiling };
};
