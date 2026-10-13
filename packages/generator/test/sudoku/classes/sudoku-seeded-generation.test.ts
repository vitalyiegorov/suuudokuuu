import { createSeededRandom } from '@suuudokuuu/solver-core';
import { describe, expect, it } from 'vitest';

import { DifficultyEnum } from '../../../src/@generic/enums/difficulty.enum';
import { defaultSudokuConfig } from '../../../src/@generic/interfaces/sudoku-config.interface';
import { Sudoku } from '../../../src/sudoku/classes/sudoku';

const seed = 20260823;
const otherSeed = 20260824;
const seedSampleCount = 8;

const createPuzzleString = (currentSeed: number): string => {
    const sudoku = new Sudoku({ ...defaultSudokuConfig, random: createSeededRandom(currentSeed) });

    sudoku.create(DifficultyEnum.Newbie);

    return sudoku.toString();
};

describe('Sudoku - Seeded Generation', () => {
    it('preserves the seeded daily puzzle for 2026-10-12', () => {
        const dailySeed = 1039959815;
        expect(createPuzzleString(dailySeed)).toBe('5.462.193.28731456361495827.93286.747425.963.685.7421981796234543.15.982259843761');
    });

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
