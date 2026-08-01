import { describe, expect, it } from '@jest/globals';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { GRID_CELL_COUNT, UNIQUENESS_COUNT_LIMIT, createSeededRandom, parseGridString } from '@suuudokuuu/solver-core';

import { HELL_CORPUS_CLUE_COUNT } from '../constants/hell-corpus.constant';

import { pickHellPuzzle } from './pick-hell-puzzle.util';

const DETERMINISM_SEED = 2026;
const SEED_SAMPLE_COUNT = 20;
const SAMPLE_SEED = 31;

const countGivens = (puzzle: string): number => puzzle.split('').filter(character => character !== '0').length;

describe('pickHellPuzzle', () => {
    it('is deterministic for a given seed', () => {
        const first = pickHellPuzzle(createSeededRandom(DETERMINISM_SEED));
        const second = pickHellPuzzle(createSeededRandom(DETERMINISM_SEED));

        expect(first).toBe(second);
    });

    it('produces different puzzles for different seeds', () => {
        const outputs = new Set(Array.from({ length: SEED_SAMPLE_COUNT }, (_, seed) => pickHellPuzzle(createSeededRandom(seed))));

        expect(outputs.size).toBeGreaterThan(1);
    });

    it('returns a 17-clue, uniquely-solvable puzzle', () => {
        const puzzle = pickHellPuzzle(createSeededRandom(SAMPLE_SEED));
        const bitmaskSolver = new BitmaskSolver();

        expect(puzzle).toHaveLength(GRID_CELL_COUNT);
        expect(countGivens(puzzle)).toBe(HELL_CORPUS_CLUE_COUNT);
        expect(bitmaskSolver.countSolutions(parseGridString(puzzle), UNIQUENESS_COUNT_LIMIT)).toBe(1);
    });
});
