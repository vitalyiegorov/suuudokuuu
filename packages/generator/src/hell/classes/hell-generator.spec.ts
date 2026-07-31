import { describe, expect, it } from '@jest/globals';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { GRID_BLANK_VALUE, GRID_CELL_COUNT, UNIQUENESS_COUNT_LIMIT, parseGridString } from '@suuudokuuu/solver-core';

import { isDefined } from '@rnw-community/shared';

import { HellGenerator } from './hell-generator';

import type { HellAdvanceResultInterface } from '../interfaces/hell-advance-result.interface';
import type { HellCandidateInterface } from '../interfaces/hell-candidate.interface';
import type { HellGeneratorOptionsInterface } from '../interfaces/hell-generator-options.interface';
import type { SolverInterface } from '@suuudokuuu/solver-core';

const RANDOM_SEED = 20260730;
const MINIMUM_GIVENS = 17;
const MAXIMUM_GIVENS = 23;
const TABU_CAPACITY = 500;
const MAXIMUM_ADVANCE_ATTEMPTS = 40;
const ADVANCE_BUDGET_MILLISECONDS = 500;
const ROYLE_17 = '000000010400000000020000000000050407008000300001090000300400200050100000000806000';
const SMALL_TABU_CAPACITY = 2;
const TABU_EVICTION_ATTEMPTS = 20;
const TABU_EVICTION_BUDGET_MILLISECONDS = 50;
const RESTART_ESCAPE_ATTEMPTS = 20;
const RESTART_ESCAPE_BUDGET_MILLISECONDS = 50;

const defaultOptions: HellGeneratorOptionsInterface = {
    randomSeed: RANDOM_SEED,
    minGivens: MINIMUM_GIVENS,
    maxGivens: MAXIMUM_GIVENS,
    tabuCapacity: TABU_CAPACITY
};

const advanceUntilCandidate = (
    generator: HellGenerator,
    maximumAttempts: number,
    budgetMilliseconds: number
): HellCandidateInterface | undefined => {
    let result: HellAdvanceResultInterface = { steps: 0 };

    for (let attempt = 0; attempt < maximumAttempts && !isDefined(result.candidate); attempt += 1) {
        result = generator.advance(budgetMilliseconds);
    }

    return result.candidate;
};

describe('HellGenerator', () => {
    it('emits a uniquely solvable candidate within the configured givens bounds', () => {
        const generator = new HellGenerator(new BitmaskSolver(), defaultOptions);

        const candidate = advanceUntilCandidate(generator, MAXIMUM_ADVANCE_ATTEMPTS, ADVANCE_BUDGET_MILLISECONDS);

        expect(candidate).toBeDefined();
        if (!isDefined(candidate)) {
            return;
        }

        expect(candidate.givensCount).toBeGreaterThanOrEqual(MINIMUM_GIVENS);
        expect(candidate.givensCount).toBeLessThanOrEqual(MAXIMUM_GIVENS);
        expect(candidate.solution.length).toBe(GRID_CELL_COUNT);

        const puzzleGrid = parseGridString(candidate.puzzle);
        const verificationSolver = new BitmaskSolver();

        expect(verificationSolver.countSolutions(puzzleGrid, UNIQUENESS_COUNT_LIMIT)).toBe(1);

        const givenCellIndexes = Array.from(puzzleGrid)
            .map((value, index) => ({ value, index }))
            .filter(cellEntry => cellEntry.value !== GRID_BLANK_VALUE);

        expect(candidate.givensCount).toBe(givenCellIndexes.length);

        for (const cellEntry of givenCellIndexes) {
            expect(Number(candidate.solution[cellEntry.index])).toBe(cellEntry.value);
        }
    });

    it('produces identical first candidates for independently constructed generators with the same seed', () => {
        const firstGenerator = new HellGenerator(new BitmaskSolver(), defaultOptions);
        const secondGenerator = new HellGenerator(new BitmaskSolver(), defaultOptions);

        const firstCandidate = advanceUntilCandidate(firstGenerator, MAXIMUM_ADVANCE_ATTEMPTS, ADVANCE_BUDGET_MILLISECONDS);
        const secondCandidate = advanceUntilCandidate(secondGenerator, MAXIMUM_ADVANCE_ATTEMPTS, ADVANCE_BUDGET_MILLISECONDS);

        expect(firstCandidate).toBeDefined();
        expect(secondCandidate).toEqual(firstCandidate);
    });

    it('does not re-emit the same puzzle in two consecutive emissions', () => {
        const generator = new HellGenerator(new BitmaskSolver(), defaultOptions);

        const firstCandidate = advanceUntilCandidate(generator, MAXIMUM_ADVANCE_ATTEMPTS, ADVANCE_BUDGET_MILLISECONDS);
        const secondCandidate = advanceUntilCandidate(generator, MAXIMUM_ADVANCE_ATTEMPTS, ADVANCE_BUDGET_MILLISECONDS);

        expect(firstCandidate).toBeDefined();
        expect(secondCandidate).toBeDefined();
        expect(secondCandidate?.puzzle).not.toBe(firstCandidate?.puzzle);
    });

    it('applies a candidate gate that can reject every candidate', () => {
        const seenCandidates: HellCandidateInterface[] = [];
        const generator = new HellGenerator(new BitmaskSolver(), {
            ...defaultOptions,
            candidateGate: candidate => {
                seenCandidates.push(candidate);

                return false;
            }
        });

        const result = generator.advance(ADVANCE_BUDGET_MILLISECONDS);

        expect(result.candidate).toBeUndefined();
        expect(seenCandidates.length).toBeGreaterThanOrEqual(1);
    });

    it('reports at least one step even without a candidate', () => {
        const generator = new HellGenerator(new BitmaskSolver(), defaultOptions);

        const result = generator.advance(1);

        expect(result.steps).toBeGreaterThanOrEqual(1);
    });

    it('adopts a seeded puzzle and emits it on the next advance', () => {
        const generator = new HellGenerator(new BitmaskSolver(), defaultOptions);

        generator.seedWith([ROYLE_17]);
        const result = generator.advance(ADVANCE_BUDGET_MILLISECONDS);

        expect(result.candidate?.puzzle).toBe(ROYLE_17);
    });

    it('skips invalid seed strings without crashing', () => {
        const generator = new HellGenerator(new BitmaskSolver(), defaultOptions);

        expect(() => void generator.seedWith(['too-short', 'x'.repeat(GRID_CELL_COUNT), ROYLE_17])).not.toThrow();

        const result = generator.advance(ADVANCE_BUDGET_MILLISECONDS);

        expect(result.candidate?.puzzle).toBe(ROYLE_17);
    });

    it('ignores an all-garbage seed list and still bootstraps normally', () => {
        const generator = new HellGenerator(new BitmaskSolver(), defaultOptions);

        expect(() => void generator.seedWith(['too-short', 'x'.repeat(GRID_CELL_COUNT)])).not.toThrow();

        const candidate = advanceUntilCandidate(generator, MAXIMUM_ADVANCE_ATTEMPTS, ADVANCE_BUDGET_MILLISECONDS);

        expect(candidate).toBeDefined();
    });

    it('is deterministic when combined with seedWith', () => {
        const firstGenerator = new HellGenerator(new BitmaskSolver(), defaultOptions);
        firstGenerator.seedWith([ROYLE_17]);
        const firstResult = firstGenerator.advance(ADVANCE_BUDGET_MILLISECONDS);

        const secondGenerator = new HellGenerator(new BitmaskSolver(), defaultOptions);
        secondGenerator.seedWith([ROYLE_17]);
        const secondResult = secondGenerator.advance(ADVANCE_BUDGET_MILLISECONDS);

        expect(secondResult).toEqual(firstResult);
    });

    it('does not emit when the solver cannot resolve a verified-unique puzzle', () => {
        const realSolverForCountSolutions = new BitmaskSolver();
        const nullSolvingSolver: SolverInterface = {
            solve: () => null,
            countSolutions: (grid, limit) => realSolverForCountSolutions.countSolutions(grid, limit)
        };
        const generator = new HellGenerator(nullSolvingSolver, defaultOptions);

        generator.seedWith([ROYLE_17]);
        const result = generator.advance(1);

        expect(result.candidate).toBeUndefined();
    });

    it('evicts the oldest tabu entry once capacity is exceeded', () => {
        const generator = new HellGenerator(new BitmaskSolver(), {
            randomSeed: RANDOM_SEED,
            minGivens: 1,
            maxGivens: GRID_CELL_COUNT,
            tabuCapacity: SMALL_TABU_CAPACITY
        });

        const emittedPuzzles = new Set<string>();
        for (let attempt = 0; attempt < TABU_EVICTION_ATTEMPTS; attempt += 1) {
            const result = generator.advance(TABU_EVICTION_BUDGET_MILLISECONDS);
            if (isDefined(result.candidate)) {
                emittedPuzzles.add(result.candidate.puzzle);
            }
        }

        expect(emittedPuzzles.size).toBeGreaterThan(SMALL_TABU_CAPACITY);
    });

    it('escapes to a fresh bootstrap after reaching the consecutive mutation-failure limit', () => {
        const realSolverForDelegation = new BitmaskSolver();
        let solveCallCount = 0;
        const alwaysAmbiguousSolver: SolverInterface = {
            solve: grid => {
                solveCallCount += 1;

                return realSolverForDelegation.solve(grid);
            },
            countSolutions: (grid, limit) =>
                limit === UNIQUENESS_COUNT_LIMIT ? UNIQUENESS_COUNT_LIMIT : realSolverForDelegation.countSolutions(grid, limit)
        };

        const generator = new HellGenerator(alwaysAmbiguousSolver, {
            randomSeed: RANDOM_SEED,
            minGivens: 1,
            maxGivens: 1,
            tabuCapacity: TABU_CAPACITY
        });

        for (let attempt = 0; attempt < RESTART_ESCAPE_ATTEMPTS; attempt += 1) {
            generator.advance(RESTART_ESCAPE_BUDGET_MILLISECONDS);
        }

        expect(solveCallCount).toBeGreaterThan(1);
    });
});
