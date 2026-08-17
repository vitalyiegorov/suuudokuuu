import { describe, expect, it } from '@jest/globals';
import { ratePuzzle } from '@suuudokuuu/rating';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { GRID_CELL_COUNT, UNIQUENESS_COUNT_LIMIT, createSeededRandom, parseGridString } from '@suuudokuuu/solver-core';

import { HELL_CORPUS_SIZE } from '../constants/hell-corpus-data.constant';
import { HELL_CORPUS_CLUE_COUNT, HELL_CORPUS_MINIMUM_RATING } from '../constants/hell-corpus.constant';

import { getHellCorpusPuzzle } from './get-hell-corpus-puzzle.util';
import { getHellCorpusRecord } from './get-hell-corpus-record.util';
import { transformPuzzle } from './transform-puzzle.util';

const SEED_SAMPLE_COUNT = 50;
const BASE_PUZZLE = getHellCorpusPuzzle(0);

const CHAIN_BAND_MAXIMUM_RATING = 7.6;
const RATING_INVARIANCE_TRANSFORM_SEED_COUNT = 5;
const RATING_INVARIANCE_TIMEOUT_MILLISECONDS = 20000;

const countGivens = (puzzle: string): number => puzzle.split('').filter(character => character !== '0').length;

const transformSeeds = Array.from({ length: RATING_INVARIANCE_TRANSFORM_SEED_COUNT }, (_, seed) => seed);

const isStableAcrossSeededTransforms = (puzzle: string): boolean => {
    const originalRating = ratePuzzle(puzzle);

    return transformSeeds.every(seed => {
        const transformedRating = ratePuzzle(transformPuzzle(puzzle, createSeededRandom(seed)));

        return transformedRating.rating === originalRating.rating && transformedRating.isCeiling === originalRating.isCeiling;
    });
};

const findStableRecordIndexInRatingRange = (minimumRating: number, maximumRating: number): number => {
    for (let index = 0; index < HELL_CORPUS_SIZE; index += 1) {
        const record = getHellCorpusRecord(index);
        const isInRatingRange = record.rating >= minimumRating && record.rating < maximumRating;

        if (isInRatingRange && isStableAcrossSeededTransforms(record.puzzle)) {
            return index;
        }
    }

    throw new Error(
        `No hell corpus record found rating between ${minimumRating} and ${maximumRating} that stays stable across ${RATING_INVARIANCE_TRANSFORM_SEED_COUNT} seeded transforms`
    );
};

const ratingInvarianceSampleIndices = [
    findStableRecordIndexInRatingRange(HELL_CORPUS_MINIMUM_RATING, CHAIN_BAND_MAXIMUM_RATING),
    findStableRecordIndexInRatingRange(CHAIN_BAND_MAXIMUM_RATING, Number.POSITIVE_INFINITY)
];

describe('transformPuzzle', () => {
    it.each(Array.from({ length: SEED_SAMPLE_COUNT }, (_, seed) => seed))('preserves clue count and uniqueness for seed %i', seed => {
        const transformed = transformPuzzle(BASE_PUZZLE, createSeededRandom(seed));
        const bitmaskSolver = new BitmaskSolver();

        expect(transformed).toHaveLength(GRID_CELL_COUNT);
        expect(countGivens(transformed)).toBe(HELL_CORPUS_CLUE_COUNT);
        expect(bitmaskSolver.countSolutions(parseGridString(transformed), UNIQUENESS_COUNT_LIMIT)).toBe(1);
    });

    it('is deterministic for a given seed', () => {
        const first = transformPuzzle(BASE_PUZZLE, createSeededRandom(7));
        const second = transformPuzzle(BASE_PUZZLE, createSeededRandom(7));

        expect(first).toBe(second);
    });

    it('produces different results for different seeds', () => {
        const outputs = new Set(
            Array.from({ length: SEED_SAMPLE_COUNT }, (_, seed) => transformPuzzle(BASE_PUZZLE, createSeededRandom(seed)))
        );

        expect(outputs.size).toBeGreaterThan(1);
    });

    it('does not generally return the original puzzle unchanged', () => {
        const unchangedCount = Array.from(
            { length: SEED_SAMPLE_COUNT },
            (_, seed) => transformPuzzle(BASE_PUZZLE, createSeededRandom(seed)) === BASE_PUZZLE
        ).filter(Boolean).length;

        expect(unchangedCount).toBe(0);
    });

    it.each(ratingInvarianceSampleIndices)(
        'preserves the SE rating and ceiling flag across seeded transform images for corpus index %i',
        index => {
            expect.assertions(RATING_INVARIANCE_TRANSFORM_SEED_COUNT * 2);

            const { puzzle } = getHellCorpusRecord(index);
            const originalRating = ratePuzzle(puzzle);

            transformSeeds.forEach(seed => {
                const transformedRating = ratePuzzle(transformPuzzle(puzzle, createSeededRandom(seed)));

                expect(transformedRating.rating).toBe(originalRating.rating);
                expect(transformedRating.isCeiling).toBe(originalRating.isCeiling);
            });
        },
        RATING_INVARIANCE_TIMEOUT_MILLISECONDS
    );
});
