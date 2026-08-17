import { statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { GRID_CELL_COUNT, UNIQUENESS_COUNT_LIMIT, parseGridString } from '@suuudokuuu/solver-core';

import { INFINITY_CORPUS_SIZE } from '../constants/infinity-corpus-data.constant';
import { INFINITY_CORPUS_MINIMUM_RATING } from '../constants/infinity-corpus.constant';

import { getInfinityCorpusPuzzle } from './get-infinity-corpus-puzzle.util';

const NEGATIVE_INDEX = -1;
const NON_INTEGER_INDEX = 1.5;
const MAXIMUM_BUNDLE_SIZE_BYTES = 4096;
const EVEREST_RATING = 11.9;
const AI_ESCARGOT_RATING = 10.6;
const PLATINUM_BLONDE_RATING = 10.9;

const allIndices = Array.from({ length: INFINITY_CORPUS_SIZE }, (_, index) => index);

describe('getInfinityCorpusPuzzle', () => {
    it('reports a small, curated corpus size', () => {
        expect(INFINITY_CORPUS_SIZE).toBeGreaterThan(0);
    });

    it.each(allIndices)('decodes a uniquely-solvable puzzle at index %i', index => {
        const { puzzle, rating } = getInfinityCorpusPuzzle(index);
        const bitmaskSolver = new BitmaskSolver();

        expect(puzzle).toHaveLength(GRID_CELL_COUNT);
        expect(bitmaskSolver.countSolutions(parseGridString(puzzle), UNIQUENESS_COUNT_LIMIT)).toBe(1);
        expect(rating).toBeGreaterThanOrEqual(INFINITY_CORPUS_MINIMUM_RATING);
    });

    it('includes known world-record anchors with their published ratings', () => {
        const ratings = allIndices.map(index => getInfinityCorpusPuzzle(index).rating);

        expect(ratings).toContain(EVEREST_RATING);
        expect(ratings).toContain(AI_ESCARGOT_RATING);
        expect(ratings).toContain(PLATINUM_BLONDE_RATING);
    });

    it('keeps the generated corpus constant well under a documented bundle-size ceiling', () => {
        const generatedFilePath = join(__dirname, '..', 'constants', 'infinity-corpus-data.constant.ts');

        expect(statSync(generatedFilePath).size).toBeLessThan(MAXIMUM_BUNDLE_SIZE_BYTES);
    });

    it('throws for a negative index', () => {
        expect(() => getInfinityCorpusPuzzle(NEGATIVE_INDEX)).toThrow();
    });

    it('throws for an index at the size boundary', () => {
        expect(() => getInfinityCorpusPuzzle(INFINITY_CORPUS_SIZE)).toThrow();
    });

    it('throws for a non-integer index', () => {
        expect(() => getInfinityCorpusPuzzle(NON_INTEGER_INDEX)).toThrow();
    });
});
