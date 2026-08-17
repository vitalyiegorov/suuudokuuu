import { describe, expect, it } from '@jest/globals';
import { createSeededRandom } from '@suuudokuuu/solver-core';

import { pickRatedCorpusPuzzle } from './pick-rated-corpus-puzzle.util';

import type { RatedCorpusPuzzleInterface } from '../interfaces/rated-corpus-puzzle.interface';

const SAMPLE_SEED = 31;
const CORPUS_SIZE = 3;
const SAMPLE_RATING = 8.1;
const SAMPLE_PUZZLE = '000000000000000001000002034000005600007000080080010700000800000300600000905000003';

const getRecord = (index: number): RatedCorpusPuzzleInterface => ({ puzzle: SAMPLE_PUZZLE, rating: SAMPLE_RATING, isCeiling: index === 0 });

describe('pickRatedCorpusPuzzle', () => {
    it('transforms the puzzle returned by the record getter while preserving rating and ceiling flag', () => {
        const random = createSeededRandom(SAMPLE_SEED);
        const result = pickRatedCorpusPuzzle(CORPUS_SIZE, getRecord, random);

        expect(result.puzzle).toHaveLength(SAMPLE_PUZZLE.length);
        expect(result.rating).toBe(SAMPLE_RATING);
        expect(typeof result.isCeiling).toBe('boolean');
    });
});
