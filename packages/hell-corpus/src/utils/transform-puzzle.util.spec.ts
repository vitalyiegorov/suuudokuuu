import { describe, expect, it } from '@jest/globals';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { GRID_CELL_COUNT, UNIQUENESS_COUNT_LIMIT, createSeededRandom, parseGridString } from '@suuudokuuu/solver-core';

import { HELL_CORPUS_CLUE_COUNT } from '../constants/hell-corpus.constant';

import { getHellCorpusPuzzle } from './get-hell-corpus-puzzle.util';
import { transformPuzzle } from './transform-puzzle.util';

const SEED_SAMPLE_COUNT = 50;
const BASE_PUZZLE = getHellCorpusPuzzle(0);

const countGivens = (puzzle: string): number => puzzle.split('').filter(character => character !== '0').length;

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
});
