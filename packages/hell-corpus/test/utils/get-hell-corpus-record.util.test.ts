import { ratePuzzle } from '@suuudokuuu/rating';
import { describe, expect, it } from 'vitest';

import { HELL_CORPUS_SIZE } from '../../src/constants/hell-corpus-data.constant';
import { HELL_CORPUS_MINIMUM_RATING } from '../../src/constants/hell-corpus.constant';
import { getHellCorpusRecord } from '../../src/utils/get-hell-corpus-record.util';

const SAMPLE_COUNT = 100;
const NEGATIVE_INDEX = -1;
const NON_INTEGER_INDEX = 1.5;

const createSpreadIndices = (count: number): number[] => {
    const indices = new Set<number>([0, HELL_CORPUS_SIZE - 1]);

    for (let sample = 0; sample < count; sample += 1) {
        indices.add(Math.floor((sample * (HELL_CORPUS_SIZE - 1)) / (count - 1)));
    }

    return [...indices];
};

describe('getHellCorpusRecord', () => {
    it('stores the rating produced for the first untransformed puzzle', () => {
        const record = getHellCorpusRecord(0);
        const report = ratePuzzle(record.puzzle);

        expect(record.rating).toBe(report.rating);
        expect(record.isCeiling).toBe(report.isCeiling);
    });

    it.each(createSpreadIndices(SAMPLE_COUNT))('returns an 81-cell puzzle and a rating at or above the minimum at index %i', index => {
        const record = getHellCorpusRecord(index);

        expect(record.puzzle).toMatch(/^\d{81}$/u);
        expect(record.rating).toBeGreaterThanOrEqual(HELL_CORPUS_MINIMUM_RATING);
    });

    it('throws for a negative index', () => {
        expect(() => getHellCorpusRecord(NEGATIVE_INDEX)).toThrow();
    });

    it('throws for an index at the size boundary', () => {
        expect(() => getHellCorpusRecord(HELL_CORPUS_SIZE)).toThrow();
    });

    it('throws for a non-integer index', () => {
        expect(() => getHellCorpusRecord(NON_INTEGER_INDEX)).toThrow();
    });
});
