import { describe, expect, it } from '@jest/globals';

import { HELL_CORPUS_SIZE } from '../constants/hell-corpus-data.constant';
import { HELL_CORPUS_MINIMUM_RATING } from '../constants/hell-corpus.constant';

import { getHellCorpusPuzzle } from './get-hell-corpus-puzzle.util';
import { getHellCorpusRecord } from './get-hell-corpus-record.util';

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
    it.each(createSpreadIndices(SAMPLE_COUNT))(
        'returns the same puzzle as getHellCorpusPuzzle and a rating at or above the minimum at index %i',
        index => {
            const record = getHellCorpusRecord(index);

            expect(record.puzzle).toBe(getHellCorpusPuzzle(index));
            expect(record.rating).toBeGreaterThanOrEqual(HELL_CORPUS_MINIMUM_RATING);
        }
    );

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
