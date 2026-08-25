import { describe, expect, it } from '@jest/globals';
import { createSeededRandom } from '@suuudokuuu/solver-core';

import { DifficultyEnum } from '../../@generic/enums/difficulty.enum';
import { defaultSudokuConfig } from '../../@generic/interfaces/sudoku-config.interface';

import { Sudoku } from './sudoku';

const seed = 20260823;
const otherSeed = 20260824;
const seedSampleCount = 8;

const createPuzzleString = (currentSeed: number): string => {
    const sudoku = new Sudoku({ ...defaultSudokuConfig, random: createSeededRandom(currentSeed) });

    sudoku.create(DifficultyEnum.Newbie);

    return sudoku.toString();
};

describe('Sudoku - Seeded Generation', () => {
    /**
     * HINT: mulberry32 is integer and bitwise only, so its stream is identical on every JavaScript
     * engine. This proves same-process reproducibility, which is the part a test can observe; the
     * cross-engine half follows from the PRNG never touching a float or a host random source.
     */
    it('should produce an identical puzzle for the same seed', () => {
        expect.assertions(1);

        expect(createPuzzleString(seed)).toBe(createPuzzleString(seed));
    });

    it('should produce a different puzzle for a different seed', () => {
        expect.assertions(1);

        expect(createPuzzleString(seed)).not.toBe(createPuzzleString(otherSeed));
    });

    it('should spread distinct seeds across distinct puzzles', () => {
        expect.assertions(1);

        const puzzles = new Set(Array.from({ length: seedSampleCount }, (_, index) => createPuzzleString(seed + index)));

        expect(puzzles.size).toBe(seedSampleCount);
    });

    it('should keep Math.random as the default source of randomness', () => {
        expect.assertions(1);

        expect(defaultSudokuConfig.random).toBe(Math.random);
    });

    it('should stay unpredictable when no seed is supplied', () => {
        expect.assertions(1);

        const first = new Sudoku();
        const second = new Sudoku();

        first.create(DifficultyEnum.Newbie);
        second.create(DifficultyEnum.Newbie);

        expect(first.toString()).not.toBe(second.toString());
    });
});
