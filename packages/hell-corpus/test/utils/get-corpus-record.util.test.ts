import { describe, expect, it } from 'vitest';

import { getCorpusRecord } from '../../src/utils/get-corpus-record.util';

const RECORD_BYTES = 22;
const RECORD_BASE64_LENGTH = 32;
const NEGATIVE_INDEX = -1;
const NON_INTEGER_INDEX = 1.5;
const RATING_TEN_POINT_SIX = 10.6;

const RED_DWARF_TEST_PUZZLE = '120340005001040000000005000000000000000000000000000000000000000000000000000000000';

const CORPUS_BASE64 = 'gAIIgEqEQhIFKABBUnQ4kUNSgQYAAAAAGymAAAAAAAAAAAAhQxVUAAAAAAAAagAA';
const CORPUS_SIZE = 2;

const LOOKUP = {
    corpusBase64: CORPUS_BASE64,
    corpusSize: CORPUS_SIZE,
    recordBase64Length: RECORD_BASE64_LENGTH,
    recordBytes: RECORD_BYTES
};

describe('getCorpusRecord', () => {
    it('rejects a record without its stored rating', () => {
        expect(() => getCorpusRecord(LOOKUP, 0)).toThrow('Corpus record at index 0 is missing its rating');
    });

    it('decodes a later record using its own slice of the corpus string', () => {
        const record = getCorpusRecord(LOOKUP, 1);

        expect(record.puzzle).toBe(RED_DWARF_TEST_PUZZLE);
        expect(record.rating).toBe(RATING_TEN_POINT_SIX);
        expect(record.isCeiling).toBe(false);
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
