import { describe, expect, it } from '@jest/globals';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { GRID_CELL_COUNT, UNIQUENESS_COUNT_LIMIT, parseGridString } from '@suuudokuuu/solver-core';
import { DLXSolver } from '@suuudokuuu/solver-dlx';

import { HELL_CORPUS_SIZE } from '../constants/hell-corpus-data.constant';
import { HELL_CORPUS_CLUE_COUNT } from '../constants/hell-corpus.constant';

import { getHellCorpusPuzzle } from './get-hell-corpus-puzzle.util';

const SAMPLE_COUNT = 200;
const CROSS_CHECK_SAMPLE_COUNT = 25;
const NEGATIVE_INDEX = -1;
const NON_INTEGER_INDEX = 1.5;
const EXPECTED_CORPUS_SIZE = 49158;

const createSpreadIndices = (count: number): number[] => {
    const indices = new Set<number>([0, HELL_CORPUS_SIZE - 1]);

    for (let sample = 0; sample < count; sample += 1) {
        indices.add(Math.floor((sample * (HELL_CORPUS_SIZE - 1)) / (count - 1)));
    }

    return [...indices];
};

const countGivens = (puzzle: string): number => puzzle.split('').filter(character => character !== '0').length;

describe('getHellCorpusPuzzle', () => {
    it('reports a corpus of exactly 49158 puzzles', () => {
        expect(HELL_CORPUS_SIZE).toBe(EXPECTED_CORPUS_SIZE);
    });

    it.each(createSpreadIndices(SAMPLE_COUNT))('decodes a valid 17-clue, uniquely-solvable puzzle at index %i', index => {
        const puzzle = getHellCorpusPuzzle(index);
        const bitmaskSolver = new BitmaskSolver();

        expect(puzzle).toHaveLength(GRID_CELL_COUNT);
        expect(countGivens(puzzle)).toBe(HELL_CORPUS_CLUE_COUNT);
        expect(bitmaskSolver.countSolutions(parseGridString(puzzle), UNIQUENESS_COUNT_LIMIT)).toBe(1);
    });

    it.each(createSpreadIndices(CROSS_CHECK_SAMPLE_COUNT))('agrees with DLXSolver at index %i', index => {
        const grid = parseGridString(getHellCorpusPuzzle(index));
        const dlxSolver = new DLXSolver();

        expect(dlxSolver.countSolutions(grid, UNIQUENESS_COUNT_LIMIT)).toBe(1);
    });

    it('throws for a negative index', () => {
        expect(() => getHellCorpusPuzzle(NEGATIVE_INDEX)).toThrow();
    });

    it('throws for an index at the size boundary', () => {
        expect(() => getHellCorpusPuzzle(HELL_CORPUS_SIZE)).toThrow();
    });

    it('throws for a non-integer index', () => {
        expect(() => getHellCorpusPuzzle(NON_INTEGER_INDEX)).toThrow();
    });
});
