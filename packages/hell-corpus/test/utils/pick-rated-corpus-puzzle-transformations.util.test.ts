import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { GRID_CELL_COUNT, UNIQUENESS_COUNT_LIMIT, createSeededRandom, parseGridString } from '@suuudokuuu/solver-core';
import { describe, expect, it } from 'vitest';

import { getHellCorpusRecord } from '../../src/utils/get-hell-corpus-record.util';
import { pickRatedCorpusPuzzle } from '../../src/utils/pick-rated-corpus-puzzle.util';

const SEED_SAMPLE_COUNT = 50;
const BASE_PUZZLE = getHellCorpusRecord(0).puzzle;

const countGivens = (puzzle: string): number => puzzle.split('').filter(character => character !== '0').length;

describe('pickRatedCorpusPuzzle transformations', () => {
    it.each(Array.from({ length: SEED_SAMPLE_COUNT }, (_, seed) => seed))('preserves clue count and uniqueness for seed %i', seed => {
        const transformed = pickRatedCorpusPuzzle(1, () => getHellCorpusRecord(0), createSeededRandom(seed)).puzzle;
        const bitmaskSolver = new BitmaskSolver();

        expect(transformed).toHaveLength(GRID_CELL_COUNT);
        expect(countGivens(transformed)).toBe(countGivens(BASE_PUZZLE));
        expect(bitmaskSolver.countSolutions(parseGridString(transformed), UNIQUENESS_COUNT_LIMIT)).toBe(1);
    });

    it('is deterministic for a given seed', () => {
        const first = pickRatedCorpusPuzzle(1, () => getHellCorpusRecord(0), createSeededRandom(7));
        const second = pickRatedCorpusPuzzle(1, () => getHellCorpusRecord(0), createSeededRandom(7));

        expect(first).toEqual(second);
    });

    it('produces different results for different seeds', () => {
        const outputs = new Set(
            Array.from(
                { length: SEED_SAMPLE_COUNT },
                (_, seed) => pickRatedCorpusPuzzle(1, () => getHellCorpusRecord(0), createSeededRandom(seed)).puzzle
            )
        );

        expect(outputs.size).toBeGreaterThan(1);
    });

    it('does not generally return the original puzzle unchanged', () => {
        const unchangedCount = Array.from(
            { length: SEED_SAMPLE_COUNT },
            (_, seed) => pickRatedCorpusPuzzle(1, () => getHellCorpusRecord(0), createSeededRandom(seed)).puzzle === BASE_PUZZLE
        ).filter(Boolean).length;

        expect(unchangedCount).toBe(0);
    });
});
